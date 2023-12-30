import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { Box } from "@mui/material";
import { Md5 } from "../types/interfaces";
const { Dragger } = Upload;

const UploadModule: React.FC<Md5> = ({ md5, onMd5Change }) => {
  const props: UploadProps = {
    name: "image",
    multiple: false,
    action: "http://127.0.0.1:8000/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        const md5Response: Md5 = JSON.parse(JSON.stringify(info.file.response));
        // Set md5 value from the Md5 instance
        if (md5Response && md5Response.md5) {
          onMd5Change(md5Response.md5);
        }
      }
      if (status === "done") {
        message.success(`${info.file.name} 上传成功`);
        const response = info.file.response;
        console.log("Server Response:", response);
      } else if (status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Box>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或者拖动图片来上传</p>
      </Dragger>
    </Box>
  );
};

export default UploadModule;
