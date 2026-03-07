import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Tag,
  Space,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Image,
  Divider,
} from "antd";
import {
  EnvironmentOutlined,
  ArrowLeftOutlined,
  WhatsAppOutlined,
  CheckCircleFilled,
  ContainerOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const DetailKost = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const item = location.state?.kost;

  if (!item) {
    return (
      <div style={{ padding: 24 }}>
        <Button onClick={() => navigate("/kost")}>Kembali ke Daftar</Button>
      </div>
    );
  }

  const photo_room = [
    item.image,
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800",
    "https://images.unsplash.com/photo-1620626011761-9963d7521476?q=80&w=800",
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        Kembali ke Daftar
      </Button>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={14}>
          <Image.PreviewGroup>
            <Image
              width="100%"
              height={400}
              src={photo_room[0]}
              style={{
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
            />
            <Row gutter={[12, 12]}>
              {photo_room.slice(1).map((url, index) => (
                <Col span={8} key={index}>
                  <Image
                    width="100%"
                    height={100}
                    src={url}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </Col>
              ))}
            </Row>
          </Image.PreviewGroup>
        </Col>

        <Col xs={24} md={10}>
          <Title level={2}>{item.nama}</Title>
          <Tag color="blue" style={{ marginBottom: 16 }}>
            {item.tipe.toUpperCase()}
          </Tag>
          <Paragraph>
            <EnvironmentOutlined /> {item.alamat}
          </Paragraph>

          <Card style={{ background: "#f5f5f5", marginBottom: 24 }}>
            <Text type="secondary">Harga Sewa</Text>
            <Title level={3} style={{ color: "#1890ff", margin: 0 }}>
              Rp {item.harga.toLocaleString("id-ID")} <small>/ bulan</small>
            </Title>
          </Card>

          <Title level={4}>Fasilitas</Title>
          <Space direction="vertical">
            <Text>
              <CheckCircleFilled style={{ color: "#52c41a" }} /> Kamar Mandi
              Dalam
            </Text>
            <Text>
              <CheckCircleFilled style={{ color: "#52c41a" }} /> WiFi Kecepatan
              Tinggi
            </Text>
            <Text>
              <CheckCircleFilled style={{ color: "#52c41a" }} /> AC & Lemari
            </Text>
          </Space>

          <Divider />
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              type="primary"
              size="large"
              icon={<ContainerOutlined />}
              style={{
                backgroundColor: "grey",
                flex: 1,
              }}
            >
              {/* onClick=
              {() => {
                handleBookingClick(roomData);
              }} */}
              Booking
            </Button>

            <Button
              type="primary"
              size="large"
              icon={<WhatsAppOutlined />}
              style={{
                backgroundColor: "#25D366",
                borderColor: "#25D366",
                flex: 1,
              }}
              // onClick={() =>
              //   window.open(`https://wa.me/${contact_phone}`, "_blank")
              // }
            >
              WhatsApp
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DetailKost;
