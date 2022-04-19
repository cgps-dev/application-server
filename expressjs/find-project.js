const LegacyProjectModel = require("../models/legacy-project");
const ProjectModel = require("../models/project");
const ProjectStateModel = require("../models/project-state");

const { StatusCodeError } = require("../utils/errors");

async function findProjectState(stateId, projectModel) {
  const id = stateId || projectModel.defaultView;

  if (typeof id === "string") {
    const stateModel = await ProjectStateModel.findOne({ project: projectModel, id });
    if (stateModel === null) {
      throw new StatusCodeError(404); // Not found
    }

    return stateModel;
  }
  else {
    return undefined;
  }
}

async function findLegacyProjec(projectSlug, stateId, user) {
  const model = await LegacyProjectModel.findOne({ shortId: projectSlug });

  // Check that the project do exist
  if (!model) {
    throw new StatusCodeError(404); // Not found
  }

  // A private project can be accessed by the user who created it
  if (model.accessLevel === 0) {
    if (user?.id) {
      // a private project can be accessed by the user who created it
      if (!model.isAccessibleBy(user.id)) {
        throw new StatusCodeError(403); // Forbidden
      }
    }
    else {
      throw new StatusCodeError(401); // Unauthorized
    }
  }

  const viewState = await findProjectState(stateId, model);

  if (viewState) {
    model.savedState = viewState.data;
    model.viewId = viewState.id;
  }

  return model;
}

async function findProject(req) {
  const projectSlug = req.query.project || req.params.project;

  if (!projectSlug) {
    throw new StatusCodeError(400); // Invalid request
  }

  let projectModel;

  try {
    projectModel = await ProjectModel.findProject(projectSlug, req.isAuthenticated() && req.user);
  }
  catch (error) {
    if (error instanceof StatusCodeError && error.message === 404) {
      projectModel = await findLegacyProjec(
        projectSlug,
        req.query.state || req.params.state,
        req.isAuthenticated() && req.user,
      );
    }
    else {
      throw error;
    }
  }

  // Check that the project do exist
  if (!projectModel) {
    throw new StatusCodeError(404); // Not found
  }

  return projectModel;
}

module.exports = (req, res, next) => {
  return Promise.resolve(req)
    .then(findProject)
    .then((model) => {
      req.project = model;
      next();
    })
    .catch(next);
};
