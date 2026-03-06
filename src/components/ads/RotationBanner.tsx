"use client";

import { useEffect, useRef } from "react";

const A8_ROTATION_SCRIPT = `
m=0,x=0,y=0;a8matArray=['4AX1OL+BN59QQ+42NG+5Z6WX','4AX0WK+FEW3O2+47L8+5ZMCH','4AX1OL+BK63PU+4V1O+609HT','4AX0WK+FOF1CI+44CA+5ZMCH','4AX0WK+EMWQ8I+4PF6+631SX','4AX1ON+BLYEJ6+4EKW+HXKQP','4AX1OL+BJKO42+5QVI+5YZ75','4AX1OL+BRWQKY+5LZE+HVV0H','4AX5KD+9VFW0I+4HV8+BXB8X','4AX5KD+9UUGEQ+3JLM+601S1','4AX0WK+F2DZYQ+40JM+1BO6EP','4AX1ON+BJKO42+5DD4+BYT9D','4AX1OL+BQPVDE+3JLM+BXYE9','4AX5KD+A4YTOY+4EKW+BXIYP','4AX5KD+9QOF6A+4JGG+BXYE9'];a8FrequencyArray=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];a8UrlParam="";while(a8matArray.length>0){try{a8ShuffleFrequency();}catch(e){break;}}if(typeof a8PointId!="undefined"){a8UrlParam+="&p="+a8PointId;}if(typeof a8ImpDisable!="undefined"){a8UrlParam+="&d=1";}function a8ShuffleFrequency(){if(a8matArray.length==1){a8UrlParam+='&m='+a8matArray[0];a8matArray.splice(0,1);return;}delNum=1;for(i=0;i<=a8FrequencyArray.length-1;i++){m+=a8FrequencyArray[i];}n=Math.floor(Math.random()*m);n++;for(i=0;i<=a8FrequencyArray.length-1;i++){x=y;y+=a8FrequencyArray[i];if(x<n&&n<=y){delNum=i;}}a8UrlParam+='&m='+a8matArray[delNum];a8matArray.splice(delNum,1);a8FrequencyArray.splice(delNum,1);}document.write('<scr'+'ipt language="JavaScript" src="//rot4.a8.net/adv.js?t=1&v=250&w=300'+a8UrlParam+'" type="text/javascript"><\\/scr'+'ipt>');
`;

export function RotationBanner() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`<!DOCTYPE html><html><head><style>body{margin:0;overflow:hidden;display:flex;align-items:center;justify-content:center;}</style></head><body><script type="text/javascript">${A8_ROTATION_SCRIPT}<\/script></body></html>`);
    doc.close();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="rounded-2xl overflow-hidden border-0 block"
      width="300"
      height="250"
      scrolling="no"
      title="PR"
    />
  );
}
