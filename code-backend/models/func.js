const zipcodes = require('../USCities.json');
const ErrorExpress = require('../errorExpress')

module.exports.zipcode = (req, res) => {
  let { zip_code } = req.params;
  if (zip_code == undefined) {
    throw new ErrorExpress("Missing zip code value.  Follow the path:  /zip_code/{zip_code}", 400);
  }
  zip_code = parseInt(zip_code);
  const zip = zipcodes.find((z) => z.zip_code === zip_code);
  if (zip) {
    return res.send(zip);
  }
  return res.status(404).send({ error: "Zip code not found" });
}