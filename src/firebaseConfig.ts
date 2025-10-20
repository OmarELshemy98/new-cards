/**
 * شرح لكل سطر في ملف firebaseConfig.ts وسبب وجوده:
 *
 * - الملف ده مسؤول عن: تهيئة Firebase مرة واحدة فقط، وتجهيز الـ services (زي Firestore, Auth)، وضبط استمرار تسجيل الدخول حتى بعد الريفريش.
 */

// بنستورد دوال تهيئة واستخدام الـ Firebase app نفسه
import { initializeApp, getApps, getApp } from "firebase/app"; // initializeApp: ينشئ كائن firebase جديد / getApps: يجيب كل الـ apps المتاحة / getApp: يجيب أول app لو موجود
// بنستورد دالة Firestore علشان نقدر نستخدم قاعدة البيانات السحابية الخاصة بفايربيز
import { getFirestore } from "firebase/firestore"; // getFirestore: بيربط المشروع الحالي بقاعدة بيانات Firestore
// بنستورد دوال auth (التوثيق) وضبط استمرار تسجيل الدخول عبر localStorage
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth"; 
// getAuth: يحصل على كائن الأوث الخاص بالتطبيق
// browserLocalPersistence: نوع حفظ استمرار تسجيل الدخول (في localStorage)
// setPersistence: يثبّت طريقة الـ persistence للمستخدمين

// بيانات إعدادات مشروع الفايربيز بتاعك، خدتها من لوحة تحكم firebase console
const firebaseConfig = {
  apiKey: "AIzaSyD3bWxidID9NovC4RIQxUI4fKOqAql2K58",                         // مفتاح الربط بـ firebase project
  authDomain: "medyourprofiles.firebaseapp.com",                              // اسم دومين auth
  projectId: "medyourprofiles",                                               // معرف المشروع بتاعك
  storageBucket: "medyourprofiles.firebasestorage.app",                       // المساحة المستخدمة لتخزين الملفات
  messagingSenderId: "250236138150",                                          // خاص بإشعارات فايربيز
  appId: "1:250236138150:web:10619e4a0c0b2aeb75ba67",                         // معرف التطبيق نفسه
  measurementId: "G-GE3RRV3WCM",                                              // خاص بتحليلات جوجل (اختياري)
};

// هنا بنشيك لو فيه Firebase app متسجل بالفعل (بسبب Hot Reload مثلًا)، نستخدمه. لو مفيش، نعمل تهيئة جديدة.
// كده هتتفادى خطأ "Firebase App named '[DEFAULT]' already exists"
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// بنجهز Export لقاعدة البيانات Firestore، وتقدر تستخدم db في أي مكان تاني في الكود
export const db = getFirestore(app); // يديك instance من Firestore متوصّل بتطبيقك

// بنجهز Export للأوثنتيكيشن (تسجيل دخول/تسجيل خروج/مستخدمين ... إلخ)
export const auth = getAuth(app); // يديك instance من خدمة Auth

// بنحدد إن حالة تسجيل الدخول تفضل محفوظة في localStorage حتى بعد الريفريش (Persistence على مستوى المتصفح)
setPersistence(auth, browserLocalPersistence); // المستخدم ميضطرش يدخل بياناته تاني بعد إعادة التحميل
