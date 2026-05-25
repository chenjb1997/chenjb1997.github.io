import { useTranslation } from "react-i18next";

const News = () => {
  const { t } = useTranslation();
  const removeOpeningLabel = (content: string) =>
    content.replace(/^(\[[^\]]+\]|【[^】]+】)\s*/, "");
  const SingleParagraph = ({text, tkey, href,}:{text:string, tkey:string, href:string})=>{
    const codeforceText = removeOpeningLabel(t(tkey))
    const index = codeforceText.indexOf(text)
    const a = <>
      {codeforceText.slice(0, index)}
      <a href={href} className="text-blue-600 hover:text-blue-800">{text}</a>
      {codeforceText.slice(index + text.length)}
    </>
    return a
  }
  const openings = [
    {
      title: "M.Phil. / Ph.D. / Research Assistant",
      content: removeOpeningLabel(t("recruit1")),
    },
    {
      title: "Joint Program with SLAI",
      content: removeOpeningLabel(t("recruit2")),
    },
    {
      title: "Competitive Programming Students",
      content: (
        <SingleParagraph
          text={t("MaChenhao")}
          tkey="news-2"
          href="https://chenhao-ma.github.io/"
        />
      ),
    },
  ];

  return (
    <div className="mb-10">
      <h2 className="border-b-[1px] border-gray-300 pb-2 text-[24px] font-bold mb-3">
        {t("news")}
      </h2>
      <div className="grid gap-2">
        {openings.map((item) => (
          <section
            key={item.title}
            className="border-l-[3px] border-amber-500 bg-white px-3 py-2 shadow-sm"
          >
            <h3 className="mb-1 text-[14px] font-semibold leading-snug text-gray-900">
              {item.title}
            </h3>
            <div className="text-[13px] leading-snug text-gray-800">
              {item.content}
            </div>
          </section>
        ))}
      </div>
        {/* <li className="p-[3_0]">
          <span className="text-[16px]">{t("news-1")}</span>
        </li>
        <li className="p-[3_0]">
          <span className="text-[16px]">{t("news-3")}</span>
        </li>
        <li className="p-[3_0]">
          <span className="text-[16px]">{t("news-5")}</span>
        </li> */}
    </div>
  );
};

export default News;
