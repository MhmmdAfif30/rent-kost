import React, { useState } from "react";
import { Tag, Space, Button, Card, Typography, Input, List, Badge } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const KostList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const sessionData = localStorage.getItem("session");
  const userRole = sessionData ? JSON.parse(sessionData).roleName : "Guest";
  const isAdminOrOwner = userRole === "Admin" || userRole === "Owner";

  const dataSource = [
    {
      key: "5",
      nama: "Kost Bahagia 1",
      alamat: "Jl. Mawar No. 10, Jakarta Pusat",
      tipe: "Putra",
      harga: 1500000,
      status: "Tersedia",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400",
    },
    {
      key: "2",
      nama: "Kost Melati 5",
      alamat: "Jl. Melati No. 05, Surabaya",
      tipe: "Putri",
      harga: 2000000,
      status: "Penuh",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400",
    },
    {
      key: "3",
      nama: "Kost Exclusive Menteng",
      alamat: "Jl. Menteng Raya No. 12, Jakarta",
      tipe: "Campur",
      harga: 3500000,
      status: "Tersedia",
      image:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=400",
    },
  ];

  const filteredData = dataSource.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchText.toLowerCase()) ||
      item.alamat.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleDetail = (item) => {
    navigate(`/detail-kost/${item.key}`, { state: { kost: item } });
  };

  const getTipeColor = (tipe) => {
    return tipe === "Putra" ? "blue" : tipe === "Putri" ? "magenta" : "purple";
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Eksplorasi Kost
          </Title>
          <Text type="secondary">Temukan hunian nyaman sesuai kebutuhanmu</Text>
        </div>
        <Space size="middle">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Cari lokasi atau nama..."
            style={{ width: 250 }}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
          />

          {isAdminOrOwner && (
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Tambah Unit
            </Button>
          )}
        </Space>
      </div>

      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={filteredData}
        renderItem={(item) => (
          <List.Item>
            <Badge.Ribbon
              text={item.status}
              color={item.status === "Tersedia" ? "green" : "volcano"}
            >
              <Card
                hoverable
                cover={
                  <img
                    alt={item.nama}
                    src={item.image}
                    style={{ height: 200, objectFit: "cover" }}
                    onClick={() => handleDetail(item)}
                  />
                }
                actions={[
                  isAdminOrOwner && (
                    <EditOutlined
                      key="edit"
                      onClick={() => console.log("Edit", item.key)}
                    />
                  ),
                  <InfoCircleOutlined
                    key="detail"
                    onClick={() => handleDetail(item)}
                  />,
                  isAdminOrOwner && (
                    <DeleteOutlined
                      key="delete"
                      style={{ color: "#ff4d4f" }}
                      onClick={() => alert(`Hapus ${item.nama}?`)}
                    />
                  ),
                ].filter(Boolean)}
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  onClick={() => handleDetail(item)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Tag color={getTipeColor(item.tipe)}>
                      {item.tipe.toUpperCase()}
                    </Tag>
                    <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
                      Rp {item.harga.toLocaleString("id-ID")}
                      <small style={{ fontSize: "12px", fontWeight: "normal" }}>
                        /bln
                      </small>
                    </Text>
                  </div>
                  <Title level={5} style={{ margin: "8px 0 4px" }}>
                    {item.nama}
                  </Title>
                  <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                    <EnvironmentOutlined style={{ marginRight: 4 }} />
                    {item.alamat}
                  </Paragraph>
                </Space>
              </Card>
            </Badge.Ribbon>
          </List.Item>
        )}
      />
    </div>
  );
};

export default KostList;
