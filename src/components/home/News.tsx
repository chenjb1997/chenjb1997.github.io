import { useTranslation } from "react-i18next";

const News = () => {
  const { t } = useTranslation();
  const openings = [
    {
      title: t("recruit1-title"),
      content: (
        <>
          {t("recruit1-before-highlight")}
          <span className="font-semibold text-amber-700">
            {t("recruit1-highlight")}
          </span>
          {t("recruit1-after-highlight")}
        </>
      ),
      accent: "border-amber-500 bg-amber-50/25",
    },
    {
      title: t("recruit2-title"),
      content: (
        <>
          <span className="font-semibold text-violet-700">
            {t("recruit2-highlight")}
          </span>
          {" "}
          {t("recruit2-body")}
        </>
      ),
      accent: "border-violet-500 bg-violet-50/25",
    },
  ];

  return (
    <div className="mt-8 mb-8">
      <h2 className="text-2xl font-semibold mb-4">{t("news")}</h2>
      <div className="grid gap-2">
        {openings.map((item) => (
          <section
            key={item.title}
            className={`border-l-[3px] px-3 py-2 shadow-sm ${item.accent}`}
          >
            <h3 className="mb-1 text-[14px] font-semibold leading-snug text-gray-900">
              {item.title}
            </h3>
            <div className="text-[13px] leading-relaxed text-gray-800">
              {item.content}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default News;
