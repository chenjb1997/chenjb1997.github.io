import { useTranslation } from "react-i18next";
import profileImage from "../../assets/chenjb.jpg";
import { FileText, Mail, Github } from "lucide-react";
const PersonalProfile = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-[180px] rounded-lg overflow-hidden">
          <img
            src={profileImage}
            alt="Jingbang Chen at The 2025 Universal Cup Finals"
          />
        </div>
        <div className="h-[14rem] flex-[1] w-full flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">陈靖邦 Jingbang Chen</h1>
            <div className="flex flex-col items-start gap-2 text-base my-1 md:gap-6 md:flex-row md:items-start">
              <a
                href="/chenjb_cv.pdf"
                download
                className="inline-flex items-center gap-2 text-blue-600 hover:text-yellow-500"
              >
                <FileText className="w-4 h-4" />
                <span>CV</span>
              </a>
              <a
                href="mailto:chenjb@cuhk.edu.cn"
                className="flex items-center gap-2 text-blue-600 hover:text-yellow-500"
              >
                <Mail className="w-5 h-5" />
                chenjb@cuhk.edu.cn
              </a>
              <a
                href="https://scholar.google.com/citations?user=UQfmkJUAAAAJ"
                target="_blank"
                className="flex items-center gap-2 text-blue-600 hover:text-yellow-500"
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
                className="flex items-center gap-2 text-blue-600 hover:text-yellow-500"
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
            <a target="_blank" href="https://sds.cuhk.edu.cn/" className="block text-[14px] text-blue-600 hover:text-yellow-500 cursor-pointer">
              {t("personal-profile-2")}
            </a>
            <a target="_blank" href="https://www.cuhk.edu.cn/" className="block text-[14px] text-blue-600 hover:text-yellow-500 cursor-pointer">
              {t("personal-profile-3")}
            </a>
            <div className="text-gray-800 text-[14px]">
              {t("personal-profile-5")}
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
