export const domains=['الإدارة المدرسية','التعليم والتعلم','نواتج التعلم','البيئة المدرسية'];
export function applicable(items,type){return items.filter(i=>type!=='government'||!i.privateOnly)}
export function summary(items,answers){
 const rated=items.filter(i=>typeof answers[i.id]?.score==='number'&&Number.isFinite(answers[i.id].score));
 return {total:items.length,completed:rated.length,coverage:items.length?rated.length/items.length*100:0,score:rated.length?rated.reduce((n,i)=>n+answers[i.id].score,0)/rated.length:null,complete:rated.length===items.length&&items.length>0};
}
export function level(score){return score===null?'لم يُقيّم':score>=90?'التميز':score>=75?'التقدم':score>=50?'الانطلاق':'التهيئة'}
export function gaps(items,answers,target){return items.filter(i=>typeof answers[i.id]?.score==='number'&&answers[i.id].score<target).map(i=>({...i,score:answers[i.id].score,gap:target-answers[i.id].score})).sort((a,b)=>b.gap-a.gap)}
export function validateState(s,items){
 if(!s||s.version!==1||!s.school||typeof s.school.name!=='string'||!['government','private','international'].includes(s.school.type)||!Number.isFinite(s.target)||s.target<0||s.target>100||!s.answers||!Array.isArray(s.tasks)||!Array.isArray(s.team)||!Array.isArray(s.cycles))throw Error('ملف النسخة الاحتياطية غير متوافق');
 for(const [id,a]of Object.entries(s.answers))if(!items.some(i=>i.id===id)||!a||!(a.score===null||(Number.isFinite(a.score)&&a.score>=0&&a.score<=100))||typeof a.notes!=='string')throw Error('تقييمات غير صالحة');
 for(const t of s.tasks)if(!t||typeof t.id!=='string'||typeof t.title!=='string'||typeof t.owner!=='string'||typeof t.date!=='string'||!['todo','doing','done'].includes(t.status))throw Error('مهام غير صالحة');
 for(const t of s.team)if(!t||typeof t.id!=='string'||typeof t.name!=='string'||typeof t.role!=='string')throw Error('فريق غير صالح');
 for(const c of s.cycles)if(!c||typeof c.name!=='string'||!Number.isFinite(c.score)||!Number.isFinite(c.total)||typeof c.date!=='string')throw Error('دورات غير صالحة');
 return s;
}
