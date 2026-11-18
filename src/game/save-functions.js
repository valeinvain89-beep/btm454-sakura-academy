import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireUser} from '@/lib/auth-middleware';
import {validSave} from './content';
export const loadCloud = createServerFn({method:'GET'}).middleware([requireUser]).handler(async({context})=>{
 const records=await context.getBase44().entities.GameSave.filter({chapter:'chapter5',created_by_id:context.user.id},'-updated_date',1);
 const items=Array.isArray(records)?records:records.items||[];
 if(!items[0])return null;
 const state=JSON.parse(items[0].snapshot);if(!validSave(state))throw new Error('Saved progress format is not supported.');
 return state;
});
export const saveCloud = createServerFn({method:'POST'}).middleware([requireUser]).validator(z.object({snapshot:z.string().max(100000)})).handler(async({context,data})=>{
 const state=JSON.parse(data.snapshot);if(!validSave(state))throw new Error('Invalid save data.');
 const client=context.getBase44();
 const records=await client.entities.GameSave.filter({chapter:'chapter5',created_by_id:context.user.id},'-updated_date',1);
 const item=(Array.isArray(records)?records:records.items||[])[0];
 const payload={chapter:'chapter5',snapshot:data.snapshot,saved_at:new Date().toISOString()};
 if(item)await client.entities.GameSave.update(item.id,payload);else await client.entities.GameSave.create(payload);
 return {saved:true};
});
