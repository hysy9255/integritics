const { asyncWrap } = require("./../utils/error");
const { S3 } = require("aws-sdk");
const uuid = require("uuid").v4;

const s3Uploadv2 = async (file) => {
  const s3 = new S3();
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${uuid()}-${file.originalname}`,
    ContentType: "image/jpeg",
    Body: file.buffer,
  };
  return await s3.upload(param).promise();
};

const uploadImage = asyncWrap(async (req, res) => {
  const file = req.files[0];
  const url = await s3Uploadv2(file);
  res.status(200).json({ status: "success", url: url.Location });
});

module.exports = {
  uploadImage,
};
