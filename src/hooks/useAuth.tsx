/**
 * ✅ شرح مبسط: 
 * 
 * الكود ده عبارة عن "هوك" و"بروڤايدر" لإدارة حالة تسجيل الدخول (الأوثنتيكيشن) في تطبيق React/Next.js باستخدام Firebase.
 * يعني بيخلّي عندك state جاهز في كل الصفحات يعرّفك المستخدم الحالي مسجّل دخول ولا لأ، ويوفرلك دوال login/logout تقدر تستدعيهم بسهولة، 
 * وكمان بيمنع ظهور محتوى غلط قبل ما يحدد حالة المستخدم بدقة (loading).
 * 
 * ----
 * طب تعال نشرح كل سطر/جزء يعمل ايه:
 */

"use client"; // لازم يكون "Client Component" لأننا هنستخدم useState/useEffect (حاجات شغالة على المتصفح بس).

import React, { 
  createContext,     // بنستخدمها لإنشاء Context جديد يمثّل حالة الأوث
  useContext,        // بنستخدمها لنقرأ الـ Context من أي مكون داخلي
  useEffect,         // عشان ننفذ كود عند التحميل أو التغيير (مثلاً نسمع التغيّر في الأوث)
  useState           // لإدارة حالة المستخدم وحالة اللودينج
} from "react"; 

import { auth } from "@/firebaseConfig"; // بنستورد نسخة الـ Auth اللي جهزناها وربطناها بتطبيق Firebase بتاعنا

import {
  onAuthStateChanged,               // فانكشن تسمع أي تغيّر في حالة الأوث (دخل/خرج)
  signInWithEmailAndPassword,       // تسجيل الدخول بالإيميل والباسورد
  createUserWithEmailAndPassword,   // إنشاء حساب جديد بالإيميل والباسورد
  signOut,                          // تسجيل الخروج
  User as FirebaseUser,             // نوع المستخدم من Firebase (للتايبينج فقط)
} from "firebase/auth";

// بنحدد شكل بيانات المستخدم اللي هنخزنها في state (مش بنخزن كل بيانات FirebaseUser، بس uid/email)
type AuthUser = {
  uid: string;            // معرّف المستخدم (id بتاعه في Firebase)
  email: string | null;   // البريد الإلكتروني (ممكن يبقى null)
};

// شكل القيم اللي Context هيديها لأي مكون يستخدم useAuth()
// user: بيانات المستخدم أو null، 
// loading: لو لسه بنعرف هل هو لوجين ولا لأ
// login: دالة تسجيل الدخول
// logout: دالة تسجيل الخروج
type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  isAdmin: boolean;
};

// بننشئ الـ Context نفسه بالقيم السابقة، ونحطه undefined في الأول عشان لو حد استخدمه غلط يظهر له خطأ واضح
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ده البروڤايدر.. بيعمل الآتي:
// - بيدير state للـ user وحالة loading
// - بيراقب حالة الأوث ويرد على أي تغيير فيها (دخول/خروج)
// - بيعرّض القيم دي في Context لكل الأطفال
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // حالة المستخدم الحالي (لو لسه مفيش حد لوجين تبقى null)
  const [user, setUser] = useState<AuthUser | null>(null);

  // حالة اللودينج (بتكون true في البداية لحد ما نحدد موقف المستخدم)
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // useEffect هنا بيشتغل مرة واحدة أول ما يتعمل mount 
  // ويسمع على طول لأي تغيير في حالة المستخدم بالتطبيق (دخل/خرج/عمل refresh)
  useEffect(() => {
    // onAuthStateChanged بيرجع unsubscribe function عشان ننضف لما المكون يتشال
    const unsub = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // لو فيه مستخدم مسجل دخول: نخزن uid/email بتوعه
        setUser({ uid: fbUser.uid, email: fbUser.email });
        // تحديد هل المستخدم أدمن بناءً على الإيميل أو الـ ownerId المرسل
        const ADMIN_EMAIL = "omarelshemy010@gmail.com";
        const ADMIN_UID = "avapcfzkydNUQC6oI7CmQ1uuhf02";
        const emailLower = (fbUser.email || "").toLowerCase();
        setIsAdmin(emailLower === ADMIN_EMAIL.toLowerCase() || fbUser.uid === ADMIN_UID);
      } else {
        // لو مفيش: نخلي user=null
        setUser(null);
        setIsAdmin(false);
      }
      // أياً كانت النتيجة، خلاص عرفنا حالة المستخدم، فـ loading=false
      setLoading(false);
    });

    // cleanup function: لما المكون يتفك، نبطل نسمع للتغييرات
    return () => unsub();
  }, []); // استخدمنا [] عشان الهاندلر يشتغل مرة بس عند الماونت

  // دالة login: بتاخد ايميل وباسورد، وتستدعي login بتاع firebase 
  // ولو تمّ الدخول بنجاح، onAuthStateChanged هتشتغل تلقائي وتحدث user
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    // مش محتاج تعمل setUser بنفسك، التحديث بيحصل تلقائي
  };

  // دالة register: بتعمل إنشاء حساب جديد، وFirebase بيولّد uid (هو ده ال ownerId الفريد)
  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
    // بعد الإنشاء، onAuthStateChanged هيحدّث user تلقائيًا
  };

  // دالة logout: بتستدعي signOut بتاع firebase
  // وبرضه onAuthStateChanged هتخلي user=null تلقائي
  const logout = async () => {
    await signOut(auth);
  };

  // البروڤايدر بيرجع Context فيه القيم دي،
  // لكن مش بيرندر الأطفال (children) غير لما loading=false
  // عشان يحمي الواجهة من عرض بيانات مش صحيحة بشكل لحظي
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, isAdmin }}>
      {/* حظرنا عرض الأطفال لو لسه بنحدد موقف المستخدم */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// ده الهوك اللي بنستخدمه عشان نجيب بيانات الأوث من أي مكان في التطبيق
export function useAuth() {
  // بناخد القيم من الـ Context
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // لو حد نسي يحط <AuthProvider> حوالي الشجرة، نرمي ايرور واضح
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  // نرجع القيم الحالية: user, loading, login, logout
  return ctx;
}
