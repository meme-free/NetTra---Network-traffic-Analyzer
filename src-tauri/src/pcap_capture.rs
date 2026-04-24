use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};

use serde::{Deserialize, Serialize};

fn rand_range(min: u64, max: u64) -> u64 {
    use std::time::SystemTime;
    let seed = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap()
        .as_nanos() as u64;
    min + (seed % (max - min + 1))
}

#[derive(Clone, Serialize, Deserialize)]
pub struct PacketInfo {
    pub id: String,
    pub timestamp: u64,
    pub source_ip: String,
    pub source_port: u16,
    pub dest_ip: String,
    pub dest_port: u16,
    pub protocol: String,
    pub length: usize,
    pub info: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct TrafficStats {
    pub bandwidth: f64,
    pub packet_rate: u64,
    pub active_ips: u64,
    pub total_bytes: u64,
    pub packets: u64,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct IPFlow {
    pub ip: String,
    pub packets: u64,
    pub bytes: u64,
    pub port: u16,
    pub protocol: String,
    pub last_seen: u64,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct PortTraffic {
    pub port: u16,
    pub bytes: u64,
    pub packets: u64,
    pub is_anomalous: bool,
    pub detected_at: u64,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct AnomalousTraffic {
    pub ip: String,
    pub port: u16,
    pub bytes: u64,
    pub duration_ms: u64,
    pub anomaly_type: String,
    pub timestamp: u64,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct ProtocolStats {
    pub name: String,
    pub value: u64,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct BandwidthPoint {
    pub time: u64,
    pub download: f64,
    pub upload: f64,
}

pub struct PacketCapture {
    is_capturing: Arc<Mutex<bool>>,
    is_generating: Arc<Mutex<bool>>,
    packets: Arc<Mutex<Vec<PacketInfo>>>,
    stats: Arc<Mutex<TrafficStats>>,
    ip_flows: Arc<Mutex<HashMap<String, IPFlow>>>,
    port_traffic: Arc<Mutex<HashMap<u16, PortTraffic>>>,
    #[allow(dead_code)]
    anomalous: Arc<Mutex<Vec<AnomalousTraffic>>>,
    protocol_counts: Arc<Mutex<HashMap<String, u64>>>,
    bandwidth_history: Arc<Mutex<Vec<BandwidthPoint>>>,
    total_bytes: Arc<Mutex<u64>>,
    start_time: Arc<Mutex<Instant>>,
    bytes_in_window: Arc<Mutex<u64>>,
    last_window_time: Arc<Mutex<Instant>>,
    packet_counter: Arc<Mutex<u64>>,
}

impl PacketCapture {
    pub fn new() -> Self {
        Self {
            is_capturing: Arc::new(Mutex::new(false)),
            is_generating: Arc::new(Mutex::new(false)),
            packets: Arc::new(Mutex::new(Vec::new())),
            stats: Arc::new(Mutex::new(TrafficStats {
                bandwidth: 0.0,
                packet_rate: 0,
                active_ips: 0,
                total_bytes: 0,
                packets: 0,
            })),
            ip_flows: Arc::new(Mutex::new(HashMap::new())),
            port_traffic: Arc::new(Mutex::new(HashMap::new())),
            anomalous: Arc::new(Mutex::new(Vec::new())),
            protocol_counts: Arc::new(Mutex::new(HashMap::new())),
            bandwidth_history: Arc::new(Mutex::new(Vec::new())),
            total_bytes: Arc::new(Mutex::new(0)),
            start_time: Arc::new(Mutex::new(Instant::now())),
            bytes_in_window: Arc::new(Mutex::new(0)),
            last_window_time: Arc::new(Mutex::new(Instant::now())),
            packet_counter: Arc::new(Mutex::new(0)),
        }
    }

    pub fn start_capture(&self) -> bool {
        let mut is_capturing = self.is_capturing.lock().unwrap();
        if *is_capturing {
            return false;
        }
        *is_capturing = true;
        drop(is_capturing);

        let is_capturing = Arc::clone(&self.is_capturing);
        let packets = Arc::clone(&self.packets);
        let _stats = Arc::clone(&self.stats);
        let ip_flows = Arc::clone(&self.ip_flows);
        let port_traffic = Arc::clone(&self.port_traffic);
        let protocol_counts = Arc::clone(&self.protocol_counts);
        let bandwidth_history = Arc::clone(&self.bandwidth_history);
        let total_bytes = Arc::clone(&self.total_bytes);
        let _bytes_in_window = Arc::clone(&self.bytes_in_window);
        let _last_window_time = Arc::clone(&self.last_window_time);
        let packet_counter = Arc::clone(&self.packet_counter);
        let is_generating = Arc::clone(&self.is_generating);
        let stats = Arc::clone(&self.stats);

        thread::spawn(move || {
            let mut wave_amp = 10i64;
            let mut wave_counter = 0u64;
            let mut total_pkts: u64 = 0;
            let mut total_bytes_sum: u64 = 0;

            loop {
                if !*is_capturing.lock().unwrap() {
                    break;
                }

                if !*is_generating.lock().unwrap() {
                    thread::sleep(Duration::from_millis(200));
                    continue;
                }

                *packet_counter.lock().unwrap() += 1;
                let counter = *packet_counter.lock().unwrap();
                
                wave_counter += 1;
                let elapsed = wave_counter as f64 / 15.0;
                let wave_val = (elapsed * 2.0 * std::f64::consts::PI).sin();
                let burst_count = (((wave_val * wave_amp as f64) as i64).abs() as u64).max(1);
                let num_packets = burst_count.min(6).max(1);
                
                for pkt_idx in 0..num_packets {
                    let timestamp = std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .unwrap()
                        .as_millis() as u64;
                
                    let vary = rand_range(1, 20);
                    let local_ip = format!("192.168.1.{}", 100 + ((counter + pkt_idx) % 8));
                    let dest_ip = format!("8.8.8.{}", (counter + vary) % 4);
                    
                    let protocols = ["TCP", "UDP", "TCP", "UDP", "ICMP", "DNS"];
                    let protocol = protocols[(counter as usize + vary as usize) % protocols.len()].to_string();
                    
                    let ports = if protocol == "TCP" {
                        vec![80, 443, 8080, 22, 3389]
                    } else if protocol == "UDP" {
                        vec![53, 123, 161, 5353]
                    } else {
                        vec![0]
                    };
                    let dest_port = ports[(counter as usize) % ports.len()];
                    let source_port = ((counter * 7 + vary * 13) % 64000 + 1024) as u16;
                    
                    let length = rand_range(64, 1460) as u64;
                    
                    let info = if protocol == "TCP" && dest_port == 443 {
                        "TLS Data".to_string()
                    } else if protocol == "UDP" && dest_port == 53 {
                        "DNS Query".to_string()
                    } else {
                        "Data".to_string()
                    };

                    let packet = PacketInfo {
                        id: format!("{}-{}", counter, pkt_idx),
                        timestamp,
                        source_ip: local_ip.clone(),
                        source_port,
                        dest_ip: dest_ip.clone(),
                        dest_port,
                        protocol: protocol.clone(),
                        length: length as usize,
                        info,
                    };

                    *total_bytes.lock().unwrap() += length;
                    total_bytes_sum += length;
                    total_pkts += 1;

                    {
                        let mut proto = protocol_counts.lock().unwrap();
                        *proto.entry(protocol.clone()).or_insert(0) += 1;
                    }

                    let flow_key = format!("{}:{}", local_ip, protocol);
                    {
                        let mut flows = ip_flows.lock().unwrap();
                        if let Some(flow) = flows.get_mut(&flow_key) {
                            flow.packets += 1;
                            flow.bytes += length;
                            flow.last_seen = timestamp;
                        } else {
                            flows.insert(flow_key.clone(), IPFlow {
                                ip: local_ip.clone(), packets: 1, bytes: length,
                                port: source_port, protocol: protocol.clone(), last_seen: timestamp
                            });
                        }
                    }

                    {
                        let mut ports = port_traffic.lock().unwrap();
                        if let Some(entry) = ports.get_mut(&dest_port) {
                            entry.bytes += length;
                            entry.packets += 1;
                        } else {
                            ports.insert(dest_port, PortTraffic {
                                port: dest_port, bytes: length, packets: 1, is_anomalous: false, detected_at: 0
                            });
                        }
                    }

                    {
                        let mut list = packets.lock().unwrap();
                        list.insert(0, packet);
                        if list.len() > 100 { list.truncate(100); }
                    }
                }
                
                let ip_count = ip_flows.lock().unwrap().len() as u64;
                let current_bw = (total_bytes_sum as f64 / 1024.0 / 1024.0).max(0.0);
                
                if (wave_counter % 20) == 0 {
                    wave_amp = -wave_amp;
                    
                    let mut bw_history = bandwidth_history.lock().unwrap();
                    bw_history.push(BandwidthPoint {
                        time: wave_counter,
                        download: current_bw * rand_range(6, 9) as f64 / 10.0,
                        upload: current_bw * rand_range(1, 4) as f64 / 10.0,
                    });
                    if bw_history.len() > 30 {
                        bw_history.remove(0);
                    }
                }
                
                *stats.lock().unwrap() = TrafficStats {
                    bandwidth: current_bw,
                    packet_rate: (total_pkts / wave_counter.max(1) * 10).max(0),
                    active_ips: ip_count,
                    total_bytes: total_bytes_sum,
                    packets: total_pkts,
                };
                
                thread::sleep(Duration::from_millis(80));
            }
        });

        *self.start_time.lock().unwrap() = Instant::now();
        true
    }

    pub fn stop_capture(&self) {
        *self.is_capturing.lock().unwrap() = false;
        *self.is_generating.lock().unwrap() = false;
    }

    pub fn is_capturing(&self) -> bool {
        *self.is_capturing.lock().unwrap()
    }

    pub fn is_generating(&self) -> bool {
        *self.is_generating.lock().unwrap()
    }

    pub fn start_generator(&self) -> bool {
        let capturing = self.is_capturing.lock().unwrap();
        if !*capturing { return false; }
        drop(capturing);
        *self.is_generating.lock().unwrap() = true;
        true
    }

    pub fn stop_generator(&self) {
        *self.is_generating.lock().unwrap() = false;
    }

    pub fn get_packets(&self, limit: usize) -> Vec<PacketInfo> {
        let packets = self.packets.lock().unwrap();
        packets.iter().take(limit).cloned().collect()
    }

    pub fn get_stats(&self) -> TrafficStats {
        self.stats.lock().unwrap().clone()
    }

    pub fn get_ip_flows(&self) -> Vec<IPFlow> {
        let mut result: Vec<IPFlow> = self.ip_flows.lock().unwrap().values().cloned().collect();
        result.sort_by(|a, b| b.bytes.cmp(&a.bytes));
        result.truncate(10);
        result
    }

    pub fn get_port_traffic(&self) -> Vec<PortTraffic> {
        let mut result: Vec<PortTraffic> = self.port_traffic.lock().unwrap().values().cloned().collect();
        result.sort_by(|a, b| b.bytes.cmp(&a.bytes));
        result.truncate(10);
        result
    }

    pub fn get_protocol_distribution(&self) -> Vec<ProtocolStats> {
        let proto = self.protocol_counts.lock().unwrap();
        let total: u64 = proto.values().sum();
        if total == 0 {
            return vec![ProtocolStats { name: "No Data".to_string(), value: 100 }];
        }
        let mut result: Vec<ProtocolStats> = proto.iter()
            .map(|(n, c)| ProtocolStats { name: n.clone(), value: *c })
            .collect();
        result.sort_by(|a, b| b.value.cmp(&a.value));
        result.truncate(3);
        result
    }

    pub fn get_bandwidth_history(&self) -> Vec<BandwidthPoint> {
        self.bandwidth_history.lock().unwrap().clone()
    }

    pub fn reset(&self) {
        self.stop_capture();
        self.packets.lock().unwrap().clear();
        *self.stats.lock().unwrap() = TrafficStats { bandwidth: 0.0, packet_rate: 0, active_ips: 0, total_bytes: 0, packets: 0 };
        self.ip_flows.lock().unwrap().clear();
        self.port_traffic.lock().unwrap().clear();
        self.protocol_counts.lock().unwrap().clear();
        self.bandwidth_history.lock().unwrap().clear();
        *self.total_bytes.lock().unwrap() = 0;
        *self.bytes_in_window.lock().unwrap() = 0;
    }
}

impl Default for PacketCapture {
    fn default() -> Self { Self::new() }
}