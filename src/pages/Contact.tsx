import React from 'react';
import { Mail, FileText, Github } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      
      <p className="text-gray-600 mb-8">
        If you have any questions, would like to discuss my research, or are interested in collaboration opportunities,
        please don't hesitate to reach out. Below, you can find the best ways to contact me.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="mailto:chenjb@cuhk.edu.cn"
          className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Mail className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800">Email</span>
        </a>

        <a
          href="https://scholar.google.com/citations?user=UQfmkJUAAAAJ"
          className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22.5c-5.79 0-10.5-4.71-10.5-10.5S6.21 1.5 12 1.5 22.5 6.21 22.5 12 17.79 22.5 12 22.5zm-.507-6.428c-.978 0-1.878-.334-2.593-.894l-2.669 1.335.894-2.669a3.864 3.864 0 01-.894-2.593c0-2.146 1.741-3.887 3.887-3.887s3.887 1.741 3.887 3.887-1.741 3.887-3.887 3.887zm0-6.428c-1.404 0-2.541 1.137-2.541 2.541s1.137 2.541 2.541 2.541 2.541-1.137 2.541-2.541-1.137-2.541-2.541-2.541z"/>
          </svg>
          <span className="text-gray-800">Google Scholar</span>
        </a>

        <a
  href="/chenjb_cv.pdf"          // path is relative to the site root
  download                // adds a “download” header so most browsers save the file
  className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
>
          <FileText className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800">Download CV</span>
        </a>

        <a
          href="https://github.com/chenjb1997"
          className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Github className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800">GitHub</span>
        </a>
      </div>
    </div>
  );
};

export default Contact;