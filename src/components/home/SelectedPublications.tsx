import React from "react";
import { useTranslation } from "react-i18next";
import { getSelectedPublications, type SelectedPublicationsItem } from "../../features/publications/catalog";

const Publications: React.FC<{ publications: SelectedPublicationsItem }> = ({
  publications,
}) => {
  return (
    <div className="home-academic-card mb-4 overflow-hidden border border-gray-200 bg-white shadow-sm">
      <h3 className="border-l-[3px] border-indigo-500 bg-gray-50 px-3 py-1.5 text-[15px] font-semibold text-gray-900">
        {publications.year}
      </h3>
      <div className="px-3 py-2">
        {publications.publications.map((pub, index) => (
          <div
            key={index}
            className="border-b border-gray-100 py-2 first:pt-0 last:border-b-0 last:pb-0"
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
                      className="text-[#1a73e8] hover:text-[#eab308] cursor-pointer"
                      href={href}
                      target="_blank"
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
            <span className="my-1 inline-block text-[13px] leading-snug text-gray-700">
              {pub.venue}
            </span>
            <div className="flex flex-wrap gap-1">
              {pub.arXiv.map(({ name, href }, index) => (
                <span key={`${name}-${index}`}>
                  <a
                    key={index}
                  className="inline-flex rounded-sm border border-blue-200 bg-white px-1.5 py-0.5 text-[11px] font-medium leading-tight text-blue-700 hover:border-amber-300 hover:text-amber-700"
                    href={href}
                    target="_blank"
                  >
                    {name}
                  </a> 
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SelectedPublications = () => {
  const { t } = useTranslation();
  const SelectedPublicationsList = getSelectedPublications(t);

  return (
    <div className="mb-10">
      <h2 className="border-b-[1px] border-gray-300 pb-2 text-[24px] font-bold mb-3">
        {t("SelectedPublications")}
      </h2>
      <span className="text-[13px] text-gray-600 block mb-3">
        {t("SelectedPublications-1")}
      </span>
      <div>
        {SelectedPublicationsList.map((item, index) => (
          <Publications key={index} publications={item} />
        ))}
      </div>
    </div>
  );
};

export default SelectedPublications;
