fn main() {
    println!("cargo:rustc-link-search=native=D:\\npcap\\npcap-sdk-1.16\\Lib\\x64");
    println!("cargo:rustc-link-lib=wpcap");
    println!("cargo:rustc-link-lib=Packet");

    tauri_build::build()
}