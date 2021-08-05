import { storage, db, getTime } from '../firebase.config';
import { ALLOWED_EXTNS } from '../constants';

import { formatFetchedData } from '@Helpers/data.helper';

const reportsRef = db.collection("reports");
const currentRef = db.collection("current");

class ReportsApi {
    static async get() {
        return await reportsRef.orderBy("createdAt", "desc").limit(20).get();
    }

    static async searchByName(query) {
        const querySnapshot = await reportsRef
            .where('fullName', '>=', query)
            .where('fullName', '<', query + 'z')
            .get();
        
        return querySnapshot;
    }

    static async searchByLabSrNo(query) {
        query = `MT_${query}`;
        const querySnapshot = await reportsRef
            .where('labSrNo', '>=', query)
            .where('labSrNo', '<', query + 'z')
            .get();
        return querySnapshot;
    }

    static async getById(id) {
        let report;

        const doc = await reportsRef.doc(id).get();
        if (doc.exists) {
            let data = doc.data();
            report = formatFetchedData(data);
        } else {
            report = null;
        }

        return report;
    }

    static async update(formData) {
        formData.updatedAt = getTime.serverTimestamp();
        return await reportsRef.doc(formData.labSrNo).update(formData);
    }

    static async save(formData) {
        formData.createdAt = getTime.serverTimestamp();
        const saveData = reportsRef.doc(`MT_${formData.lab + 1}`).set(formData);
        const updateCurrent = currentRef.doc(formData.id).update({
            lab: formData.lab + 1,
            refrence: formData.refrence + 1,
        });
        return await Promise.all([saveData, updateCurrent]);
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
        const querySnapshot = await currentRef.get();
        querySnapshot.forEach((doc) => {
            res = { id: doc.id, ...doc.data() };
        });
        return res;
    }

    static async delete(photoName, id) {
        const deleteReport = reportsRef.doc(id).delete();
        const deletePhoto = storage.ref().child(`images/${photoName}`).delete();
        await Promise.all([deleteReport, deletePhoto]);
    }

    static async resetReference() {
        const snapshot = await currentRef.get();
        const docId = snapshot.docs[0].id;
        await currentRef.doc(docId).update({ refrence: 0 });
    }
}

export default ReportsApi;