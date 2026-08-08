import { useTranslation } from "react-i18next";
import profileImage from "../../assets/chenjb.png";
import { FileText, Mail, Github } from "lucide-react";
const PersonalProfile = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-8">
      <div className="home-profile-layout flex flex-col items-center md:flex-row">
        <div className="home-profile-photo shrink-0 rounded-lg overflow-hidden">
          <img
            src={profileImage}
            alt="Jingbang Chen at The 2025 Universal Cup Finals"
          />
        </div>
        <div className="min-h-[15rem] flex-[1] w-full flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">陈靖邦 Jingbang Chen</h1>
            <div className="home-profile-contact-row my-1">
              <a
                href="/chenjb_cv.pdf"
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-blue-600 hover:text-yellow-500"
              >
                <FileText className="w-4 h-4" />
                <span>CV</span>
              </a>
              <a
                href="mailto:chenjb@cuhk.edu.cn"
                className="flex shrink-0 items-center gap-2 whitespace-nowrap text-blue-600 hover:text-yellow-500"
              >
                <Mail className="w-5 h-5" />
                chenjb@cuhk.edu.cn
              </a>
              <a
                href="https://scholar.google.com/citations?user=UQfmkJUAAAAJ"
                target="_blank"
                className="flex shrink-0 items-center gap-2 whitespace-nowrap text-blue-600 hover:text-yellow-500"
              >
                <svg
                  className="w-5 h-5 "
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22.5c-5.79 0-10.5-4.71-10.5-10.5S6.21 1.5 12 1.5 22.5 6.21 22.5 12 17.79 22.5 12 22.5zm-.507-6.428c-.978 0-1.878-.334-2.593-.894l-2.669 1.335.894-2.669a3.864 3.864 0 01-.894-2.593c0-2.146 1.741-3.887 3.887-3.887s3.887 1.741 3.887 3.887-1.741 3.887-3.887 3.887zm0-6.428c-1.404 0-2.541 1.137-2.541 2.541s1.137 2.541 2.541 2.541 2.541-1.137 2.541-2.541-1.137-2.541-2.541-2.541z" />
                </svg>
                Google Scholar
              </a>
              <a
                href="https://github.com/chenjb1997"
                target="_blank"
                className="flex shrink-0 items-center gap-2 whitespace-nowrap text-blue-600 hover:text-yellow-500"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
          <div className="">
            <div className="text-gray-900 text-[14px] font-bold">
              {t("personal-profile-1")}
            </div>
            <a target="_blank" href="https://sds.cuhk.edu.cn/" className="inline text-[14px] text-blue-600 hover:text-yellow-500 cursor-pointer">
              {t("personal-profile-2")}
            </a>
              <span className="text-[14px]">{t("personal-profile-separator")}</span>
              <a target="_blank" href="https://www.cuhk.edu.cn/" className="inline text-[14px] text-blue-600 hover:text-yellow-500 cursor-pointer">
              {t("personal-profile-3")}
            </a>
            <div className="text-[14px]">
              <a target="_blank" href="https://www.slai.edu.cn/en/node/377" className="inline text-blue-600 hover:text-yellow-500 cursor-pointer">
                {t("personal-profile-6")}
              </a>
              <span>{t("personal-profile-separator")}</span>
              <a target="_blank" href="https://www.slai.edu.cn/" className="inline text-blue-600 hover:text-yellow-500 cursor-pointer">
                {t("personal-profile-5")}
              </a>
            </div>
            <div className="text-gray-800 text-[14px]">
              {t("personal-profile-4")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PersonalProfile;
