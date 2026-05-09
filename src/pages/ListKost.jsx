import React, { useState } from "react";
import { Tag, Space, Button, Card, Typography, Input, List, Badge, Select, Row, Col } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { formatIDR } from '../components/Global/Formatter';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const KostList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filterKost, setFilterKost] = useState(null);
  const [filterLantai, setFilterLantai] = useState(null);
  const [filterKamar, setFilterKamar] = useState(null);

  const sessionData = localStorage.getItem("session");
  const userRole = sessionData ? JSON.parse(sessionData).roleName : "Guest";
  const isAdminOrOwner = userRole === "Admin" || userRole === "Owner";

  const dataSource = [
    {
      key: "5",
      nama: "Kost Bahagia 1",
      alamat: "Jl. Mawar No. 10, Jakarta Pusat",
      tipe: "Putra",
      lantai: "1",
      kategoriKamar: "reguler",
      harga: 1500000,
      status: "Tersedia",
      coords: [-6.1847, 106.8302],
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400",
    },
    {
      key: "2",
      nama: "Kost Melati 5",
      alamat: "Jl. Melati No. 05, Surabaya",
      tipe: "Putri",
      lantai: "2",
      kategoriKamar: "vip",
      harga: 2000000,
      status: "Penuh",
      coords: [-7.2575, 112.7521],
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400",
    },
    {
      key: "3",
      nama: "Kost Exclusive Menteng",
      alamat: "Jl. Menteng Raya No. 12, Jakarta",
      tipe: "Campur",
      lantai: "3",
      kategoriKamar: "vvip",
      harga: 3500000,
      status: "Tersedia",
      coords: [-6.1915, 106.8331],
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=400",
    },
  ];

  const filteredData = dataSource.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchText.toLowerCase()) ||
      item.alamat.toLowerCase().includes(searchText.toLowerCase());
    const matchesKost = filterKost ? item.nama.toLowerCase().includes(filterKost.toLowerCase()) : true;
    const matchesLantai = filterLantai ? item.lantai === filterLantai : true;
    const matchesKamar = filterKamar ? item.kategoriKamar === filterKamar : true;
    return matchesSearch && matchesKost && matchesLantai && matchesKamar;
  });

  const handleDetail = (item) => {
    navigate(`/detail-kost/${item.key}`, { state: { kost: item } });
  };

  const getTipeColor = (tipe) => {
    return tipe === "Putra" ? "blue" : tipe === "Putri" ? "magenta" : "purple";
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header & Search Bar (Tetap di Atas) */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Eksplorasi Kost</Title>
          <Text type="secondary">Cari hunian impianmu di peta</Text>
        </div>
        <Space size="middle" wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Cari lokasi..."
            style={{ width: 200 }}
            size="large"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select placeholder="Kost" style={{ width: 120 }} size="large" allowClear onChange={setFilterKost}>
            <Option value="Bahagia">Bahagia</Option>
            <Option value="Melati">Melati</Option>
            <Option value="Menteng">Menteng</Option>
          </Select>
          <Select placeholder="Lantai" style={{ width: 100 }} size="large" allowClear onChange={setFilterLantai}>
            <Option value="1">Lantai 1</Option>
            <Option value="2">Lantai 2</Option>
            <Option value="3">Lantai 3</Option>
          </Select>
          {isAdminOrOwner && (
            <Button type="primary" icon={<PlusOutlined />} size="large">Tambah</Button>
          )}
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* KOLOM KIRI: DAFTAR KOST */}
        <Col xs={24} lg={14} xl={15}>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
            dataSource={filteredData}
            renderItem={(item) => (
              <List.Item>
                <Badge.Ribbon text={item.status} color={item.status === "Tersedia" ? "green" : "volcano"}>
                  <Card
                    hoverable
                    cover={<img alt={item.nama} src={item.image} style={{ height: 160, objectFit: "cover" }} onClick={() => handleDetail(item)} />}
                    actions={[
                      isAdminOrOwner && <EditOutlined key="edit" />,
                      <InfoCircleOutlined key="detail" onClick={() => handleDetail(item)} />,
                      isAdminOrOwner && <DeleteOutlined key="delete" style={{ color: "#ff4d4f" }} />,
                    ].filter(Boolean)}
                  >
                    <div onClick={() => handleDetail(item)}>
                      <Tag color={getTipeColor(item.tipe)}>{item.tipe.toUpperCase()}</Tag>
                      <Text strong style={{ float: 'right', color: '#1890ff' }}>Rp {formatIDR(item.harga)}</Text>
                      <Title level={5} style={{ margin: "8px 0 0" }}>{item.nama}</Title>
                      <Text type="secondary" size="small" ellipsis><EnvironmentOutlined /> {item.alamat}</Text>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </List.Item>
            )}
          />
        </Col>

        {/* KOLOM KANAN: PETA (STICKY) */}
        <Col xs={24} lg={10} xl={9}>
          <div style={{ 
            position: "sticky", 
            top: 24, 
            height: "calc(100vh - 48px)", 
            borderRadius: "12px", 
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <MapContainer 
              center={[-6.2000, 106.8166]} 
              zoom={11} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredData.map((item) => (
                <Marker key={item.key} position={item.coords}>
                  <Popup>
                    <strong>{item.nama}</strong><br/>
                    {item.alamat}<br/>
                    <Button type="link" size="small" onClick={() => handleDetail(item)}>Lihat Detail</Button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default KostList;