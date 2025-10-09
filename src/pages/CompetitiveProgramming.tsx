import React from 'react';
import { useTranslation } from 'react-i18next';

const CompetitiveProgramming = () => {
  const { t } = useTranslation();

  const SingleParagraph = ({text, tkey, href}:{text:string, tkey:string, href:string})=>{
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("Competitive-Programming")}</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4  text-[16px]">
          {t("programming-first-paragraph")}
        </p>
        <p className="mb-4  text-[16px]">
          {t("programming-second-paragraph")}
        </p>
        <p className="mb-4  text-[16px]">
          <SingleParagraph text="Codeforces" tkey="programming-third-paragraph" href="https://codeforces.com/profile/chenjb" />
        </p>

        <p className="mb-4  text-[16px]">
          {/*  SUA 程序设计竞赛命题组 */}
          <SingleParagraph text={t("SUA")} tkey="programming-fourth-paragraph" href="https://sua.ac/" />
        </p>

        <p className="mb-8  text-[16px]">
          <SingleParagraph text="Universal Cup" tkey="programming-fifth-paragraph" href="https://ucup.ac/" />
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("Coaching")}</h2>
        <ul className="list-disc pl-5 space-y-2  text-[16px]">
          <li>{t("Coaching-1")}</li>
          <li>{t("Coaching-2")}</li>
          <li>{t("Coaching-3")}</li>
          <li>{t("Coaching-4")}</li>
          <li>{t("Coaching-5")}</li>
          <li>{t("Coaching-6")}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("Awards")}</h2>
        <ul className="list-disc pl-5 space-y-2  text-[16px]">
          <li>{t("Awards-1")}</li>
          <li>{t("Awards-2")}</li>
          <li>{t("Awards-3")}</li>
          <li>{t("Awards-4")}</li>
          <li>{t("Awards-5")}</li>
          <li>{t("Awards-6")}</li>
          <li>{t("Awards-7")}</li>
          <li>{t("Awards-8")}</li>
          <li>{t("Awards-9")}</li>
          <li>{t("Awards-10")}</li>
          <li>{t("Awards-11")}</li>
          <li>{t("Awards-12")}</li>
          <li>{t("Awards-13")}</li>
          <li>{t("Awards-14")}</li>
          <li>{t("Awards-15")}</li>
          <li>{t("Awards-16")}</li>
          <li>{t("Awards-17")}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("ProblemSettingJudging")}</h2>
        <ul className="list-disc pl-5 space-y-2  text-[16px]">
          <li>{t("ProblemSettingJudging-1")}</li>
          <li>{t("ProblemSettingJudging-2")}</li>
          <li>{t("ProblemSettingJudging-3")}</li>
          <li>{t("ProblemSettingJudging-4")}</li>
          <li>{t("ProblemSettingJudging-5")}</li>
          <li>{t("ProblemSettingJudging-6")}</li>
          <li>{t("ProblemSettingJudging-7")}</li>
          <li>{t("ProblemSettingJudging-8")}</li>
          <li>{t("ProblemSettingJudging-9")}</li>
          <li>{t("ProblemSettingJudging-10")}</li>
          <li>{t("ProblemSettingJudging-11")}</li>
          <li>{t("ProblemSettingJudging-12")}</li>
          <li>{t("ProblemSettingJudging-13")}</li>
          <li>{t("ProblemSettingJudging-14")}</li>
          <li>{t("ProblemSettingJudging-15")}</li>
          <li>{t("ProblemSettingJudging-16")}</li>
          <li>{t("ProblemSettingJudging-17")}</li>
          <li>{t("ProblemSettingJudging-18")}</li>
          <li>{t("ProblemSettingJudging-19")}</li>
          <li>{t("ProblemSettingJudging-20")}</li>
          <li>{t("ProblemSettingJudging-21")}</li>
          <li>{t("ProblemSettingJudging-22")}</li>
          <li>{t("ProblemSettingJudging-23")}</li>
          <li>{t("ProblemSettingJudging-24")}</li>
          <li>{t("ProblemSettingJudging-25")}</li>
          <li>{t("ProblemSettingJudging-26")}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("Others")}</h2>
        <ul className="list-disc pl-5 space-y-2  text-[16px]">
          <li>
            <SingleParagraph text='Keystone Wiki' tkey='Others-1' href="http://keystone.wiki/" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CompetitiveProgramming;