use std::sync::Mutex;
use tauri::State;

mod pcap_capture;

use pcap_capture::{AnomalousTraffic, BandwidthPoint, IPFlow, PacketCapture, PacketInfo, PortTraffic, ProtocolStats, TrafficStats};

pub struct CaptureState(pub Mutex<PacketCapture>);

#[tauri::command]
fn start_capture(state: State<'_, CaptureState>) -> Result<bool, String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    Ok(capture.start_capture())
}

#[tauri::command]
fn stop_capture(state: State<'_, CaptureState>) -> Result<(), String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    capture.stop_capture();
    Ok(())
}

#[tauri::command]
fn is_capturing(state: State<'_, CaptureState>) -> Result<bool, String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    Ok(capture.is_capturing())
}

#[tauri::command]
fn get_packets(state: State<'_, CaptureState>, limit: usize) -> Result<Vec<PacketInfo>, String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    Ok(capture.get_packets(limit))
}

#[tauri::command]
fn get_stats(state: State<'_, CaptureState>) -> Result<TrafficStats, String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    Ok(capture.get_stats())
}

#[tauri::command]
fn get_ip_flows(state: State<'_, CaptureState>) -> Result<Vec<IPFlow>, String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    Ok(capture.get_ip_flows())
}

#[tauri::command]
fn get_port_traffic(state: State<'_, CaptureState>) -> Result<Vec<PortTraffic>, String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    Ok(capture.get_port_traffic())
}

#[tauri::command]
fn get_protocol_distribution(state: State<'_, CaptureState>) -> Result<Vec<ProtocolStats>, String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    Ok(capture.get_protocol_distribution())
}

#[tauri::command]
fn get_bandwidth_history(state: State<'_, CaptureState>) -> Result<Vec<BandwidthPoint>, String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    Ok(capture.get_bandwidth_history())
}

#[tauri::command]
fn reset_capture(state: State<'_, CaptureState>) -> Result<(), String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    capture.reset();
    Ok(())
}

#[tauri::command]
fn is_generating(state: State<'_, CaptureState>) -> Result<bool, String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    Ok(capture.is_generating())
}

#[tauri::command]
fn get_anomalous_traffic(state: State<'_, CaptureState>) -> Result<Vec<AnomalousTraffic>, String> {
    let _capture = state.0.lock().map_err(|e| e.to_string())?;
    Ok(Vec::new())
}

#[tauri::command]
fn start_gen(state: State<'_, CaptureState>) -> Result<bool, String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    if !capture.is_capturing() {
        capture.start_capture();
    }
    Ok(capture.start_generator())
}

#[tauri::command]
fn stop_gen(state: State<'_, CaptureState>) -> Result<(), String> {
    let capture = state.0.lock().map_err(|e| e.to_string())?;
    capture.stop_generator();
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let capture = PacketCapture::new();
    capture.start_capture();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(CaptureState(Mutex::new(capture)))
        .invoke_handler(tauri::generate_handler![
            start_capture,
            stop_capture,
            is_capturing,
            is_generating,
            start_gen,
            stop_gen,
            get_packets,
            get_stats,
            get_ip_flows,
            get_port_traffic,
            get_protocol_distribution,
            get_bandwidth_history,
            reset_capture,
            get_anomalous_traffic,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}