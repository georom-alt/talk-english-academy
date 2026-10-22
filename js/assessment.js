/* Goal-based course guidance; the short quiz is not a proficiency certificate. */
(function () {
'use strict';
function recommend(a) {
 const score=['q1','q2','q3','q4','q5','q6'].reduce((n,k)=>n+(a[k]==='1'?1:0),0);
 const support=a.confidence==='0'||a.skill==='start'||a.experience==='never'||score<3;
 if(a.audience==='kids')return {course:'kids',track:'',score,reason:'kids',support:false};
 const allowed=['beginner','daily','business','interview','cruise','hotel','office-it','manufacturing-construction','maritime','massage-spa','nail','restaurant-service','warehousing-logistics','love-across-borders','corporate-a1','corporate-a2'];
 let course,reason;
 if(allowed.includes(a.interest)){course=a.interest;reason='interest';}
 else if(a.task==='interview'||a.goal==='interview'){course='interview';reason='task';}
 else if(a.goal==='corporate'){course=a.confidence==='2'&&score>=5&&a.experience==='independent'?'corporate-a2':'corporate-a1';reason='corporate';}
 else if(a.task==='relationship'||a.goal==='relationship'){course='love-across-borders';reason='relationship';}
 else if(a.sector&&a.sector!=='general'){course=a.sector;reason='sector';}
 else if(a.task==='business'||a.goal==='business'){course='business';reason='task';}
 else if(a.task==='service'){course='restaurant-service';reason='service';}
 else {course=a.confidence==='0'&&a.skill==='start'?'beginner':'daily';reason='goal';}
 const track=course==='interview'?(a.confidence==='2'&&score>=5&&a.experience==='independent'?'advanced':'beginner'):'';
 return {course,track,score,reason,support,urgent:a.urgency==='now',practice:a.practice,skill:a.skill};
}
if(typeof module!=='undefined'&&module.exports){module.exports={recommend};return;}
const form=document.getElementById('course-assessment');if(!form)return;
const result=document.getElementById('assessment-result'),course=document.getElementById('student-course'),track=document.getElementById('student-interview-track'),registration=document.getElementById('enquiry-form');
let current=null;
const reasons={
 interest:['Bạn đã chọn khóa học này là sở thích chính. Điểm tiếng Anh không thay đổi lựa chọn đó.','You selected this course as your main interest. Your English score does not override that choice.'],
 task:['Khóa học phù hợp với công việc giao tiếp bạn cần thực hiện.','The course matches the communication task you need to perform.'],
 service:['Gợi ý Nhà hàng và Dịch vụ khách hàng vì bạn chọn giao tiếp với khách nhưng chưa chọn ngành cụ thể. George sẽ xác nhận bối cảnh trước khi xếp lớp.','Restaurant and Customer Service is suggested because you chose customer communication without a specific industry. George will confirm the setting before placement.'],
 kids:['Gợi ý chương trình trẻ em. George sẽ trao đổi với phụ huynh để chọn nhóm tuổi và hoạt động phù hợp.','Suggested Kids programme. George will discuss the age group and suitable activities with the parent.'],
 foundation:['Nên xây dựng nền tảng trước, sau đó chuyển sang mục tiêu hoặc môi trường bạn đã chọn.','Build your foundation first, then move toward your selected goal or work setting.'],
 interview:['Theo mục tiêu phỏng vấn và câu trả lời của bạn. Lộ trình sẽ được xác nhận sau phần nói.','Based on your interview goal and answers. The track will be confirmed after a speaking sample.'],
 corporate:['Gợi ý cho nhu cầu học theo nhóm doanh nghiệp; George cần xác nhận mức phù hợp của cả nhóm.','Suggested for a corporate group; George needs to confirm suitability for the whole group.'],
 relationship:['Theo mục tiêu giao tiếp trong mối quan hệ xuyên văn hóa. Chương trình chỉ dành cho người từ 18 tuổi.','Based on your cross-cultural relationship goal. This programme is for adults aged 18 and over.'],
 sector:['Theo môi trường làm việc bạn chọn. Đây là tiếng Anh thực tế, không phải đào tạo hay chứng chỉ nghề.','Based on your chosen work setting. This is practical English, not occupational training or certification.'],
 goal:['Theo mục tiêu giao tiếp và câu trả lời của bạn.','Based on your communication goal and answers.']};
function label(key){return Array.from(course.options).find(o=>o.value===key)?.textContent||key;}
function summary(){return JSON.stringify({version:2,...Object.fromEntries(new FormData(form)),recommendation:current.course,track:current.track,quiz_score:current.score,follow_on_interest:current.next||''});}
function render(){const en=document.documentElement.lang==='en';form.querySelectorAll('[data-assessment-vi]').forEach(o=>{o.textContent=en?o.dataset.assessmentEn:o.dataset.assessmentVi;});if(!current)return;document.getElementById('assessment-course').textContent=label(current.course)+(current.track?' — '+(current.track==='advanced'?'Advanced':'Beginner'):'');document.getElementById('assessment-reason').textContent=reasons[current.reason][en?1:0]+(current.reason==='kids'?'':` ${en?'Short English check':'Câu hỏi tiếng Anh'}: ${current.score}/6.`)+(current.support?(en?' Extra foundation and speaking support is suggested within your chosen goal; confirm this in the trial.':' Nên bổ sung hỗ trợ nền tảng và luyện nói theo mục tiêu đã chọn; xác nhận trong buổi học thử.'):'')+(current.urgent?(en?' Your deadline is this month: discuss a focused plan with George.':' Bạn cần sử dụng trong tháng này: trao đổi với George về kế hoạch tập trung.'):'')+(current.practice==='little'?(en?' Outside practice is optional. We can focus on essentials together in class.':' Luyện tập ngoài giờ là tự chọn. Chúng ta có thể cùng luyện phần quan trọng trong lớp.'):'')+(current.next?` ${en?'Follow-on interest':'Mục tiêu tiếp theo'}: ${label(current.next)}.`:'');}
function clear(){current=null;result.hidden=true;registration.querySelector('[name="self_assessment"]')?.remove();}
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;current=recommend(Object.fromEntries(new FormData(form)));result.hidden=false;render();result.focus();});
function syncAudience(){const child=form.elements.audience.value==='kids';form.querySelectorAll('[data-assessment-group]').forEach(group=>{const hide=group.dataset.assessmentGroup===(child?'adult':'child');group.hidden=hide;group.querySelectorAll('select').forEach(sel=>{sel.disabled=hide;});});}
form.addEventListener('change',()=>{clear();syncAudience();});form.addEventListener('reset',()=>{clear();setTimeout(syncAudience,0);});
syncAudience();
document.getElementById('assessment-register').addEventListener('click',()=>{if(!current)return;course.value=current.course;course.dispatchEvent(new Event('change',{bubbles:true}));if(track&&!track.disabled)track.value=current.track;let field=registration.querySelector('[name="self_assessment"]');if(!field){field=document.createElement('input');field.type='hidden';field.name='self_assessment';registration.appendChild(field);}field.value=summary();document.getElementById('student-name')?.focus({preventScroll:true});});
render();
new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

