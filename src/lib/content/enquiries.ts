import 'server-only';
import { presidentPreviewLocked } from '../president-preview';
import { database } from '@/lib/backend/server';
import { requireAdmin } from '@/lib/admin/auth';
export function enquiryMode(){return !presidentPreviewLocked()&&['test','approved'].includes(process.env.ENQUIRIES_MODE??'')?process.env.ENQUIRIES_MODE as 'test'|'approved':'disabled';}
export async function intakeMode(){const mode=enquiryMode();if(mode==='disabled')return mode;try{const db=database();if(!db)return 'disabled';const r=await db.from('cms_control').select('enquiry_mode').eq('id',true).single();return r.data?.enquiry_mode===mode?mode:'disabled';}catch{return 'disabled';}}
export type EnquiryRecord={id:string;name:string;email:string;phone:string;interest:string;pathway:string;topic:string;message:string;status:string;private_notes:string;version:number;created_at:string;is_test:boolean};
export async function adminEnquiries(){await requireAdmin();try{const db=database();if(!db)throw Error();const r=await db.from('club_enquiries').select('id,name,email,phone,interest,pathway,topic,message,status,private_notes,version,created_at,is_test').order('created_at',{ascending:false}).limit(1000);if(r.error)throw Error();return {available:true,rows:r.data as EnquiryRecord[]};}catch{return {available:false,rows:[] as EnquiryRecord[]};}}
