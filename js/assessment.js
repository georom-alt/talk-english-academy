/* Goal-based course guidance; the short quiz is not a proficiency certificate. */
(function () {
'use strict';
function recommend(a) {
 const score=['q1','q2','q3'].reduce((n,k)=>n+(a[k]==='1'?1:0),0);
 if(a.audience==='kids') return {course:'kids',track:'',score,reason:'kids'};
 const foundation=a.confidence==='0'||score<=1;
 if(a.goal==='interview') return {course:'interview',track:!foundation&&a.confidence==='2'&&score===3?'advanced':'beginner',score,reason:'interview'};
 if(a.goal==='corporate') return {course:!foundation&&a.confidence==='2'&&score===3?'corporate-a2':'corporate-a1',track:'',score,reason:'corporate'};
 if(foundation)return {course:'beginner',track:'',score,reason:'foundation',next:a.sector!=='general'?a.sector:a.goal==='relationship'?'love-across-borders':a.goal};
 if(a.goal==='relationship')return {course:'love-across-borders',track:'',score,reason:'relationship'};
 if(a.sector!=='general')return {course:a.sector,track:'',score,reason:'sector'};
 return {course:a.goal==='business'?'business':'daily',track:'',score,reason:'goal'};
}
if(typeof module!=='undefined'&&module.exports){module.exports={recommend};return;}
const form=document.getElementById('course-assessment');if(!form)return;
const result=document.getElementById('assessment-result'),course=document.getElementById('student-course'),track=document.getElementById('student-interview-track'),registration=document.getElementById('enquiry-form');
let current=null;
const reasons={
 kids:['Gợi ý chương trình trẻ em. George sẽ trao đổi với phụ huynh để chọn nhóm tuổi và hoạt động phù hợp.','Suggested Kids programme. George will discuss the age group and suitable activities with the parent.'],
 foundation:['Nên xây dựng nền tảng trước, sau đó chuyển sang mục tiêu hoặc môi trường bạn đã chọn.','Build your foundation first, then move toward your selected goal or work setting.'],
 interview:['Theo mục tiêu phỏng vấn và câu trả lời của bạn. Lộ trình sẽ được xác nhận sau phần nói.','Based on your interview goal and answers. The track will be confirmed after a speaking sample.'],
 corporate:['Gợi ý cho nhu cầu học theo nhóm doanh nghiệp; George cần xác nhận mức phù hợp của cả nhóm.','Suggested for a corporate group; George needs to confirm suitability for the whole group.'],
 relationship:['Theo mục tiêu giao tiếp trong mối quan hệ xuyên văn hóa. Chương trình chỉ dành cho người từ 18 tuổi.','Based on your cross-cultural relationship goal. This programme is for adults aged 18 and over.'],
 sector:['Theo môi trường làm việc bạn chọn. Đây là tiếng Anh thực tế, không phải đào tạo hay chứng chỉ nghề.','Based on your chosen work setting. This is practical English, not occupational training or certification.'],
 goal:['Theo mục tiêu giao tiếp và câu trả lời của bạn.','Based on your communication goal and answers.']};
function label(key){return Array.from(course.options).find(o=>o.value===key)?.textContent||key;}
function summary(){return JSON.stringify({version:1,...Object.fromEntries(new FormData(form)),recommendation:current.course,track:current.track,quiz_score:current.score,follow_on_interest:current.next||''});}
function render(){if(!current)return;const en=document.documentElement.lang==='en';document.getElementById('assessment-course').textContent=label(current.course)+(current.track?' — '+(current.track==='advanced'?'Advanced':'Beginner'):'');document.getElementById('assessment-reason').textContent=reasons[current.reason][en?1:0]+(current.reason==='kids'?'':` ${en?'Short English check':'Câu hỏi tiếng Anh'}: ${current.score}/3.`)+(current.next?` ${en?'Follow-on interest':'Mục tiêu tiếp theo'}: ${label(current.next)}.`:'');}
function clear(){current=null;result.hidden=true;registration.querySelector('[name="self_assessment"]')?.remove();}
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;current=recommend(Object.fromEntries(new FormData(form)));result.hidden=false;render();result.focus();});
form.addEventListener('change',clear);form.addEventListener('reset',clear);
document.getElementById('assessment-register').addEventListener('click',()=>{if(!current)return;course.value=current.course;course.dispatchEvent(new Event('change',{bubbles:true}));if(track&&!track.disabled)track.value=current.track;let field=registration.querySelector('[name="self_assessment"]');if(!field){field=document.createElement('input');field.type='hidden';field.name='self_assessment';registration.appendChild(field);}field.value=summary();document.getElementById('student-name')?.focus({preventScroll:true});});
new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
