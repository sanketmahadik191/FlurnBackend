import e from "express";
import uploadDefaultDataIntoDbFromCsvFileController from "../Controllers/uploadDefaultDataIntoDbFromCsvFile.Controller.mjs";
import multer from "multer";
import { nanoid } from "nanoid";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const newFileName = nanoid(21) + "." + file.originalname.split(".").at(-1);
    cb(null, newFileName);
  },
});
const upload = multer({ storage: storage });

const UploadDefaultDataIntoDbFromCsvFileRouter = e.Router();

UploadDefaultDataIntoDbFromCsvFileRouter.post(
  "/uploadSeats",
  upload.single("csvFile"),
  uploadDefaultDataIntoDbFromCsvFileController.uploadSeatsDataIntoDbFromCsvFile
);
UploadDefaultDataIntoDbFromCsvFileRouter.post(
  "/uploadSeatsPricingData",
  upload.single("csvFile"),
  uploadDefaultDataIntoDbFromCsvFileController.uploadSeatsPricingDataIntoDbFromCsvFile
);

export default UploadDefaultDataIntoDbFromCsvFileRouter;
