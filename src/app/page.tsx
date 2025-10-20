/**
 * الملف ده بسيط جدًا: الصفحة الرئيسية "/" بتعيد تصدير صفحة البزنس كاردز.
 * يعني لما تفتح "/" فعليًا هتروح لصفحة "app/business-cards/page.tsx".
 */

// export { default } from "./business-cards/page";
// => السطر ده بيقول لنيكست: خد الـ default export اللي في المسار ده
//    واعتبره هو الـ default export بتاع الملف ده.
//    النتيجة: route "/" بيستخدم نفس كومبوننت صفحة business-cards.

export { default } from "./business-cards/page";
