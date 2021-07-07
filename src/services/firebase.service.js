import { storage, db } from '../firebase.config';

const reportsRef = db.collection("reports");
const storageRef = storage.ref('images');

class ReportsApi {
    async get() {
        let snapshot;

        try {
            snapshot = await reportsRef.orderBy("labSrNo", "desc").limit(15).get();
        } catch(err) {
            console.log(err);
        }

        return snapshot;
    }

    async find(option, value) {
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

    async delete(photoName, id) {
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