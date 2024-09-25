import { getFirestore } from "@firebase/firestore";
import {app} from '@/app/firebase/config';

const db = getFirestore(app);

export default db;