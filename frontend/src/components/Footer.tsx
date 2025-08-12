import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} JSW Energy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
