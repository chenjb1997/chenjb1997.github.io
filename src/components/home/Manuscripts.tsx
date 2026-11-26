import React from "react";
import { useTranslation } from "react-i18next";
import { getManuscripts, type ManuscriptGroup } from "../../features/publications/catalog";

const Publications: React.FC<{ publications: ManuscriptGroup }> = ({
  publications,
}) => {
  return (
    <div className="mb-4">
      <div className="space-y-3">
        {publications.publications.map((pub, index) => (
          <div
            key={index}
            className="home-academic-card border-l-[3px] border-sky-500 bg-white px-3 py-2 shadow-sm"
          >
            <div className="text-[15px] font-semibold leading-snug text-gray-900">
              {pub.title}
            </div>
            <div className="mt-0.5 text-[13px] leading-snug text-gray-600">
              {pub.authors.map(({ name, href }, index) => (
                <span key={index} className="mr-1.5 inline-block">
                  {name.includes("Jingbang Chen") ? (
                    <span className="font-bold text-black">
                      {name}
                    </span>
                  ) : href && href !== "#" ? (
                    <a
                      href={href}
                      target="_blank"
                      className="text-[#1a73e8] hover:text-[#eab308] cursor-pointer"
                    >
                      {name}
                    </a>
                  ) : (
                    <span>{name}</span>
                  )}
                  <span>{index === pub.authors.length - 1 ? "" : ","}</span>
                </span>
              ))}
            </div>
            {pub.arXiv.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {pub.arXiv.map(({ name, href }, index) => (
                  <a
                    href={href}
                    key={index}
                    target="_blank"
                    className="inline-flex rounded-sm border border-blue-200 bg-white px-1.5 py-0.5 text-[11px] font-medium leading-tight text-blue-700 hover:border-amber-300 hover:text-amber-700"
                  >
                    {name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Manuscripts = () => {
  const { t } = useTranslation();
  const SelectedPublicationsList = getManuscripts(t);

  return (
    <div className="mb-10">
      <h2 className="border-b-[1px] border-gray-300 pb-2 text-[24px] font-bold mb-3">
        {t("Manuscripts")}
      </h2>
      <p className="mb-3 text-[13px] text-gray-600">
        {t("SelectedPublications-1")}
      </p>
      <div>
        {SelectedPublicationsList.map((item, index) => (
          <Publications key={index} publications={item} />
        ))}
      </div>
    </div>
  );
};

export default Manuscripts;
