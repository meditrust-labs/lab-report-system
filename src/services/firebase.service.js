import { storage, db } from '../firebase.config';
import { ALLOWED_EXTNS } from '../constants';
import { convertDate, getNumericData } from '../utils/date.helper';

const reportsRef = db.collection("reports");
const currentRef = db.collection("current");
// const storageRef = storage.ref('images');

class ReportsApi {
    static async get() {
        let snapshot;

        try {
            snapshot = await reportsRef.orderBy("labSrNo", "desc").limit(15).get();
        } catch(err) {
            console.log(err);
        }

        return snapshot;
    }

    static async getById(id) {
        let report;

        try {
            const doc = await reportsRef.doc(id).get();
            if (doc.exists) {
                let data = doc.data();
                data["dateExamined"] = convertDate(data["dateExamined"]);
                data["dateExpiry"] = convertDate(data["dateExpiry"]);
                data["dob"] = convertDate(data["dob"]);
                data["doi"] = convertDate(data["doi"]);

                data["weight"] = getNumericData(data["weight"]);
                data["height"] = getNumericData(data["height"]);
                data["urea"] = getNumericData(data["urea"]);
                data["creatinine"] = getNumericData(data["creatinine"]);
                data["bloodSugar"] = getNumericData(data["bloodSugar"]);
                data["hemoglobin"] = getNumericData(data["hemoglobin"]);
                data["bloodPressure"] = getNumericData(data["bloodPressure"]);
                data["bloodSugar"] = getNumericData(data["bloodSugar"]);

                report = data;
            } else {
                report = null;
            }
        } catch (err) {
            console.log(err);
        }

        return report;
    }

    static async update(labSrNo, formData) {
        return await reportsRef.doc(labSrNo).update(formData);
    }

    static async save(current, formData) {
        const saveData = reportsRef.doc(`MT_${current.lab + 1}`).set(formData);
        const updateCurrent = currentRef.doc(current.id).update({
            lab: current.lab + 1,
            refrence: current.refrence + 1,
        });

        return await Promise.all([saveData, updateCurrent]);
    }

    static async find(option, value) {
        let querySnapshot;
        try {
            if (value.length === 0) {
                querySnapshot = await this.get();
            } else {
                querySnapshot = await reportsRef.where(option, "==", value).get();
            }
        } catch (err) {
            console.log(err);
        }

        return querySnapshot;
    }

    static async upload(photo) {
        return new Promise((resolve, reject) => {
                if (!photo) {
                    reject("Please select a file");
                }
                if (!ALLOWED_EXTNS.exec(photo.name)) {
                    reject("Please upload a .jpg or .jpeg file");
                }

                const date = new Date().toISOString();
                const name = photo.name + "_" + date;

                const uploadTask = storage.ref(`images/${name}`).put(photo);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {},
                    (error) => {
                        console.log(error);
                        reject(error);
                    },
                    () => {
                        storage
                        .ref("images")
                        .child(name)
                        .getDownloadURL()
                        .then((url) => {
                            resolve({url, name});
                        });
                    }
                );
        })
    }

    static async getCurrent() {
        let res;
        try {
            const querySnapshot = await currentRef.get();
            querySnapshot.forEach((doc) => {
                res = { id: doc.id, ...doc.data() };
            });
        } catch (err) {
          console.log(err);
        }

        return res;
    }

    static async delete(photoName, id) {
        try {
            const deleteReport = db.collection("reports").doc(id).delete();
            const deletePhoto = storage.ref().child(`images/${photoName}`).delete();

            await Promise.all([deleteReport, deletePhoto]);
        } catch (err) {
            console.log(err);
        }
    }
}

export default ReportsApi;