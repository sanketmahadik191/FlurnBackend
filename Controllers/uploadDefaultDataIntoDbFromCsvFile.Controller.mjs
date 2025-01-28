import CustomError from "../Utils/CustomError.mjs";
import csvParser from "csv-parser";
import fs from "node:fs";
import SeatsModel from "../Models/SeatsModel.mjs";
import SeatsPricingModel from "../Models/SeatsPricingModel.mjs";

// this method appends documents to the collection, if called multiple times with same data will result in redundant data, users need to manually delete the collection before calling this method
const uploadSeatsDataIntoDbFromCsvFile = async (req, res, next) => {
  try {
    // read data from csv file
    const results = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          resolve();
        })
        .on("error", () => reject());
    });
    // push data into DB
    const savedPromises = results.map(async (obj) => {
      try {
        const doc = new SeatsModel(obj);
        await doc.save();
      } catch (error) {
        console.error(`Error saving document: ${error.message}`);
        throw new CustomError(500, `Failed to save document: ${error.message}`);
      }
    });
    await Promise.all(savedPromises);

    // return response
    res.json({
      success: true,
      message: "Seats Data has been saved successfully into DB!",
    });
  } catch (error) {
    next(
      new CustomError(
        500,
        "failed to uploadDefaultDataIntoDbFromCsvFile: " + error.message
      )
    );
  } finally {
    // delete the file from uploads
    fs.unlinkSync(req.file.path);
  }
};

// this method appends documents to the collection, if called multiple times with same data will result in redundant data, users need to manually delete the collection before calling this method
const uploadSeatsPricingDataIntoDbFromCsvFile = async (req, res, next) => {
  try {
    // read data from csv file
    const results = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          resolve();
        })
        .on("error", () => reject());
    });

    // push data into DB
    const savedPromises = results.map(async (obj) => {
      try {
        const doc = new SeatsPricingModel(obj);
        await doc.save();
      } catch (error) {
        console.error(`Error saving document: ${error.message}`);
        throw new CustomError(500, `Failed to save document: ${error.message}`);
      }
    });
    await Promise.all(savedPromises);

    // return response
    res.json({
      success: true,
      message: "SeatsPricing Data has been saved successfully into DB!",
    });
  } catch (error) {
    next(
      new CustomError(
        500,
        "failed to uploadSeatsPricingDataIntoDbFromCsvFile: " + error.message
      )
    );
  } finally {
    // delete the file from uploads
    fs.unlinkSync(req.file.path);
  }
};

const uploadDefaultDataIntoDbFromCsvFileController = {
  uploadSeatsDataIntoDbFromCsvFile,
  uploadSeatsPricingDataIntoDbFromCsvFile,
};
export default uploadDefaultDataIntoDbFromCsvFileController;
