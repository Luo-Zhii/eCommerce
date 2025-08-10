import mongoose, { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Spu";
const COLLECTION_NAME = "Spus";

var spuSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      default: "",
    },
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_slug: {
      type: String, // quan-ao-cao-cap
    },

    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_category: {
      type: Array,
      default: [],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },

    /*
        attr_id: 12345, // style ao (he, dong)
        attr_values: [
            {
                values_id: 123
            }
        ]
    */

    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },

    /*
        tier_variations:[
            {
                img: [],
                name: 'color',
                options: ['red']
            },
            {
                img: [],
                name: 'size',
                options: ['S', 'M']
            }
        ]
    */

    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const spu = model(DOCUMENT_NAME, spuSchema);

export { spu };
