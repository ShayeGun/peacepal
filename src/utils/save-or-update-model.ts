import mongoose from "mongoose";

export const SaveOrUpdateModel = async <T extends typeof mongoose.Model>(identifier: Record<string, any>, data: Record<string, any>, model: T) => {
    const existedData = await model.findOne(identifier);

    if (!existedData) {
        const newData = new model({ ...identifier, ...data });
        newData.save();

        return newData;
    }
    else {
        // FIX: if needed update this
        for (let [k, v] of Object.entries(data)) {
            if ((existedData as any)[k] !== v) (existedData as any)[k] = v;
        }

        if (existedData!.isModified()) await existedData!.save();

        return existedData;
    }
};