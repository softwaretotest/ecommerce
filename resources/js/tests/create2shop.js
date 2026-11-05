import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/config.firebase.js";

const FAKE_USER_ID = "OSbzhOC12yg27yHv6TsEMzcNuRr2";

async function hackCreateShop() {
    const shopData = {
        name: "HACKED SHOP",
        image: "",
        user_id: FAKE_USER_ID,
        created_at: Date.now(),
    };

    try {
        const ref = await addDoc(collection(db, "shops"), shopData);

        console.log("❌ HACK SUCCESS?");
        console.log("created id =", ref.id);
    } catch (err) {
        console.log("✅ BLOCKED BY FIRESTORE RULES");
        console.log(err);
    }
}

await hackCreateShop();
