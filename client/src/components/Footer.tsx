const Footer = () => {
  return (
    <div className="text-center md:text-sm text-[8px] border-black border-t md:bg-gray-50 py-4 bg-black md:text-black text-white text-xl" >
        <div className="flex justify-center gap-3 px-4 mb-4 ">
            <div className="cursor-pointer">About</div>
            <div className="cursor-pointer">Help</div>
            <div className="cursor-pointer">Terms</div>
            <div className="cursor-pointer">Privacy</div>
        </div>
      <div className=" justify-center">
        © Copyright 2025 | Designed and Developed By : Developer{" "}
        <a href="https://github.com/RaiYunan" className="font-bold">
          Yunan Rai
        </a>
      </div>
    </div>
  );
};

export default Footer;
