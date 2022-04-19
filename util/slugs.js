const slugify = require("slugify");

module.exports.toSlug = function toSlug(id, title) {
  let path = id;
  if (title) {
    const slug = slugify(
      title,
      {
        lower: true,
        strict: true,
      },
    );
    path += `-${slug}`;
  }
  return path;
};

module.exports.fromSlug = function fromSlug(idOrSlug) {
  if ((/^[0-9A-Z]{22}-/i).test(idOrSlug)) {
    return idOrSlug.substr(0, 22);
  }
  else {
    return idOrSlug;
  }
};
