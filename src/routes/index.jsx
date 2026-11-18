import {createFileRoute} from '@tanstack/react-router';
import Academy from '@/game/Academy';
export const Route=createFileRoute('/')({head:()=>({meta:[{title:'Sakura Tech Academy · IT Guardian'},{name:'description',content:'A Japanese-inspired pixel learning adventure for technology management. Chapter 5: explore, decide, reflect.'}]}),component:Academy});
