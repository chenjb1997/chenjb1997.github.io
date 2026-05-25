import { useTranslation } from "react-i18next";
import localPng from "../../assets/local.png"
const Education = () => {
  const { t } = useTranslation();
  const list = [
    {
      degree: t("edu-1-degree"),
      school: t("edu-1-school"),
      location: t("edu-1-location"),
      time: t("edu-1-time"),
      country: t("country-canada"),
    },
    {
      degree: t("edu-2-degree"),
      school: t("edu-2-school"),
      location: t("edu-2-location"),
      time: t("edu-2-time"),
      country: t("country-usa"),
    },
    {
      degree: t("edu-3-degree"),
      school: t("edu-3-school"),
      location: t("edu-3-location"),
      time: t("edu-3-time"),
      country: t("country-china"),
    },
    {
      degree: t("edu-4-degree"),
      school: t("edu-4-school"),
      location: t("edu-4-location"),
      time: t("edu-4-time"),
      country: t("country-china"),
    }
  ]


  return (
    <div className="mb-10">
      <h2 className="border-b-[1px] border-gray-300 pb-2 text-[24px] font-bold mb-3">
        {t("education")}
      </h2>
      <div className="grid gap-2">
        {
          list.map((item) => (
            <div
              key={item.degree}
              className="border-l-[3px] border-sky-500 bg-white px-3 py-2 shadow-sm"
            >
              <div className="flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-3">
                <div className="text-[14px] font-semibold leading-snug text-gray-900">
                  {item.degree}
                </div>
                <div className="shrink-0 text-[12px] leading-snug text-gray-500">
                  {item.time}
                </div>
              </div>
              <div className="mt-0.5 text-[13px] leading-snug text-gray-700">
                {item.school}
              </div>
              <div className="mt-0.5 flex items-center text-[12px] leading-snug text-gray-500">
                <img
                  src={localPng}
                  alt=""
                  className="mr-1 inline-block h-[12px] w-[12px]"
                />
                {item.location}, {item.country}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Education;
