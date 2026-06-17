import React, { useState, useEffect } from "react";
import {
  Tag, Space, Button, Card, Typography, Input, List, Badge,
  Select, Row, Col, Spin, Empty, Pagination, Tooltip, message
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { formatIDR } from '../../components/Global/Formatter';
import { listKost } from "../../api/kost";

const { Title, Text } = Typography;

// Komponen untuk menampilkan fasilitas dari database
const FacilitiesDisplay = ({ facilities }) => {
  if (!facilities || facilities === "") {
    return (
      <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px solid #f0f0f0", height: 40 }}>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          Tidak ada fasilitas
        </Text>
      </div>
    );
  }

  let facilityList = [];

  if (typeof facilities === 'string') {
    facilityList = facilities.split(',').map(f => f.trim());
  } else if (Array.isArray(facilities)) {
    facilityList = facilities;
  }

  const shortenFacilityName = (name) => {
    if (name.length > 20) {
      return name.substring(0, 18) + '...';
    }
    return name;
  };

  const displayFacilities = facilityList.slice(0, 3);
  const remainingCount = facilityList.length - 3;

  return (
    <div style={{
      marginTop: 12,
      paddingTop: 8,
      borderTop: "1px solid #f0f0f0",
      minHeight: 40
    }}>
      <Space size={8} wrap>
        {displayFacilities.map((facility, idx) => (
          <Tooltip key={idx} title={facility}>
            <Tag
              style={{
                fontSize: "11px",
                borderRadius: "4px",
                margin: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 4
              }}
            >
              <span>{shortenFacilityName(facility)}</span>
            </Tag>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <Tooltip title={facilityList.slice(3).join(', ')}>
            <Tag style={{ fontSize: "11px", borderRadius: "4px", background: "#f0f0f0", cursor: "pointer" }}>
              +{remainingCount}
            </Tag>
          </Tooltip>
        )}
      </Space>
    </div>
  );
};

const KostList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filterTipe, setFilterTipe] = useState(null);
  const [filterHarga, setFilterHarga] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen untuk filter dari LayoutHeader
  useEffect(() => {
    const handleFilterChange = (event) => {
      setSearchText(event.detail.searchText || "");
      setFilterTipe(event.detail.filterTipe || null);
      setFilterHarga(event.detail.filterHarga || null);
    };

    window.addEventListener('kostFilterChange', handleFilterChange);

    return () => {
      window.removeEventListener('kostFilterChange', handleFilterChange);
    };
  }, []);

  const fetchKostData = async () => {
    setLoading(true);
    try {
      const res = await listKost();
      const resData = res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
      const data = resData.map((item) => ({
        key: item.room_kost_id?.toString() || Math.random().toString(),
        nama: item.nama_kost,
        alamat: item.address,
        tipe: item.tipe_kost,
        lantai: item.lantai,
        kategoriKamar: item.kategori_kamar,
        harga: item.harga ? parseFloat(item.harga) : 0,
        status: item.status,
        image: item.photo_kost,
        fasilitas: item.fasilitas
      }));
      setDataSource(data);
    } catch (error) {
      message.error('Gagal memuat data kost');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKostData();
  }, []);

  const filteredData = dataSource.filter((item) => {
    const matchSearch = !searchText ||
      item.nama?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.alamat?.toLowerCase().includes(searchText.toLowerCase());
    const matchTipe = !filterTipe ||
      (item.tipe && item.tipe.trim().toLowerCase() === filterTipe.trim().toLowerCase());
    const matchHarga = !filterHarga ||
      (filterHarga === "under500" && item.harga < 500000) ||
      (filterHarga === "500-1m" && item.harga >= 500000 && item.harga <= 1000000) ||
      (filterHarga === "above1m" && item.harga > 1000000);
    return matchSearch && matchTipe && matchHarga;
  });

  const handleDetail = (item) => {
    navigate(`/detail-kost/${item.key}`, { state: { kost: item } });
  };

  const handleFavorite = (key, e) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
    message.success(favorites.includes(key) ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit');
  };

  const getTipeColor = (tipe) => {
    if (!tipe) return "default";
    const tipeLower = tipe.toLowerCase();
    if (tipeLower === "putra") return "blue";
    if (tipeLower === "putri") return "pink";
    if (tipeLower === "campur") return "green";
    return "default";
  };

  return (
    <div style={{
      padding: "16px 24px 24px 24px",
      background: "#f0f2f5",
      minHeight: "calc(100vh - 120px)"
    }}>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={24} xl={24}>
            {filteredData.length === 0 ? (
              <Card style={{ textAlign: "center", padding: "40px" }}>
                <Empty description="Tidak ada kost yang ditemukan" />
              </Card>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-8px' }}>
                {filteredData.map((item) => (
                  <div
                    key={item.key}
                    style={{
                      width: 'calc(33.333% - 16px)',
                      margin: '8px',
                      flexShrink: 0
                    }}
                  >
                    <Badge.Ribbon
                      text={item.status}
                      color={item.status === "Tersedia" ? "green" : "red"}
                    >
                      <Card
                        hoverable
                        style={{
                          borderRadius: "12px",
                          overflow: "hidden",
                          height: "100%",
                        }}
                        bodyStyle={{ padding: "16px" }}
                        cover={
                          <div style={{ height: 200, overflow: "hidden" }}>
                            <img
                              alt={item.nama}
                              src={item.image || "https://placehold.co/400x200?text=Kost"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                cursor: "pointer",
                                transition: "transform 0.3s ease"
                              }}
                              onClick={() => handleDetail(item)}
                            />
                          </div>
                        }
                        actions={[
                          <Tooltip title="Lihat Detail">
                            <EyeOutlined onClick={() => handleDetail(item)} />
                          </Tooltip>,
                          <Tooltip title={favorites.includes(item.key) ? "Hapus favorit" : "Tambah favorit"}>
                            {favorites.includes(item.key) ?
                              <HeartFilled style={{ color: "#ff4d4f" }} onClick={(e) => handleFavorite(item.key, e)} /> :
                              <HeartOutlined onClick={(e) => handleFavorite(item.key, e)} />
                            }
                          </Tooltip>,
                        ]}
                      >
                        <div onClick={() => handleDetail(item)} style={{ cursor: "pointer" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
                            <Tag color={getTipeColor(item.tipe)} style={{ margin: 0 }}>
                              {item.tipe}
                            </Tag>
                            <Text strong style={{ color: "#1890ff", whiteSpace: "nowrap" }}>
                              Rp {formatIDR(item.harga)}
                              <span style={{ fontSize: "11px", fontWeight: "normal" }}>/bln</span>
                            </Text>
                          </div>
                          <Title level={5} style={{ margin: "8px 0 4px", fontSize: "16px", minHeight: "48px" }}>
                            {item.nama}
                          </Title>
                          <Text
                            type="secondary"
                            style={{
                              fontSize: "12px",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 4,
                              minHeight: "40px"
                            }}
                          >
                            <EnvironmentOutlined style={{ flexShrink: 0, marginTop: "2px" }} />
                            <span style={{ wordBreak: "break-word", lineHeight: "1.4" }}>{item.alamat}</span>
                          </Text>
                          <FacilitiesDisplay facilities={item.fasilitas} />
                        </div>
                      </Card>
                    </Badge.Ribbon>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Spin>

      <style>
        {`
          @media (max-width: 768px) {
            div[style*="width: calc(33.333%"] {
              width: calc(50% - 16px) !important;
            }
          }
          @media (max-width: 576px) {
            div[style*="width: calc(33.333%"] {
              width: calc(100% - 16px) !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default KostList;