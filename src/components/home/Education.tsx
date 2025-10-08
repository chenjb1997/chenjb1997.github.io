import { useTranslation } from "react-i18next";
import localPng from "../../assets/local.png"
const Education = () => {
  const { t } = useTranslation();
  const list = [
    {
      degree: t("edu-1-degree"),
      school: t("edu-1-school"),
      location: t("edu-1-location"),
      time: t("edu-1-time")
    },
    {
      degree: t("edu-2-degree"),
      school: t("edu-2-school"),
      location: t("edu-2-location"),
      time: t("edu-2-time")
    },
    {
      degree: t("edu-3-degree"),
      school: t("edu-3-school"),
      location: t("edu-3-location"),
      time: t("edu-3-time")
    },
    {
      degree: t("edu-4-degree"),
      school: t("edu-4-school"),
      location: t("edu-4-location"),
      time: t("edu-4-time")
    }
  ]


  return (
    <div className="mb-10">
      <h2 className="border-b-[1px] border-gray-300 pb-2 text-[24px] font-bold mb-3">
        {t("education")}
      </h2>
      <div className='relative'>
        {
          list.map((item) => (
            <div key={item.degree} className="p-3 rounded-[3] border-l-[3px] border-solid mt-2">
              <div className="flex justify-between">
                <div className="font-bold flex-[1]  text-[16px]">{item.degree}</div>
                <div className="text-[16px]">{item.time}</div>
              </div>
              <div className="text-[16px]"> 
               {item.school}
              </div>
              <div className="text-[14px] text-gray-500 flex items-center">
                <img src={localPng} alt="" className="w-[13px] h-[13px] inline-block mr-[4px]"/>
                {item.location}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Education;
