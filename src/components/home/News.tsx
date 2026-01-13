import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "lucide-react";

const News = () => {
  const { t } = useTranslation();
  const SingleParagraph = ({text, tkey, href,}:{text:string, tkey:string, href:string})=>{
    const codeforceText = t(tkey)
    const index = codeforceText.indexOf(text)
    const a = <>
      {codeforceText.slice(0, index)}
      <a href={href} className="text-blue-600 hover:text-blue-800">{text}</a>
      {codeforceText.slice(index + text.length)}
    </>
    return a
  }

  return (
    <div className="mb-10">
      <h2 className="border-b-[1px] border-gray-300 pb-2 text-[24px] font-bold mb-3">
        {t("news")}
      </h2>
      <ul
        className={`px-3 list-disc space-y-3 text-lg text-gray-900`}
      >
        <li className="p-[3_0]">
          <span className="text-[16px]">{t("recruit1")}</span>
        </li>
        <li className="p-[3_0]">
          <span className="text-[16px]">{t("recruit2")}</span>
        </li>
        <li className="p-[3_0]">
          <span className="text-[16px]">
            <SingleParagraph text={t("MaChenhao")} tkey="news-2" href="https://chenhao-ma.github.io/" />
          </span>
        </li>
        <li className="p-[3_0]">
          <span className="text-[16px]">{t("news-1")}</span>
        </li>
        <li className="p-[3_0]">
          <span className="text-[16px]">{t("news-3")}</span>
        </li>
        <li className="p-[3_0]">
          <span className="text-[16px]">{t("news-5")}</span>
        </li>
      </ul>
    </div>
  );
};

export default News;
