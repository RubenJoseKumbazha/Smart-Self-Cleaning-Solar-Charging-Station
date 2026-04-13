import random
import time

class SolarBenchSimulation:
    def __init__(self):
        # Hardware specs from provided documents
        self.battery_capacity_wh = 300  # 12V 25Ah avg
        self.current_charge_wh = 150    # Starting at 50%
        self.solar_panel_max_w = 20     # 20W Panel
        self.is_cleaning = False
        self.gsm_connected = True
        self.total_revenue = 0

    def get_solar_input(self, hour):
        """Simulates solar generation based on time of day."""
        if 6 <= hour <= 18:
            # Peak sun between 11am and 3pm
            efficiency = max(0, 1 - abs(13 - hour) / 7)
            return self.solar_panel_max_w * efficiency
        return 0

    def simulate_hour(self, hour):
        print(f"--- Time: {hour:02d}:00 ---")
        
        # 1. Solar Generation
        generation = self.get_solar_input(hour)
        self.current_charge_wh = min(self.battery_capacity_wh, self.current_charge_wh + generation)
        
        # 2. Automated Cleaning (Scheduled at Dawn 6AM)
        if hour == 6:
            self.is_cleaning = True
            self.current_charge_wh -= 5 # Power cost for pump
            print("[System] Morning Cleaning Cycle Active...")
        else:
            self.is_cleaning = False

        # 3. User Interaction (Randomized charging sessions)
        if 8 <= hour <= 20 and random.random() > 0.5:
            sessions = random.randint(1, 2)
            power_draw = sessions * 10 # Approx 10W per 30-min charge
            if self.current_charge_wh > power_draw:
                self.current_charge_wh -= power_draw
                self.total_revenue += sessions * 1.5 # Simulating $1.50 per token
                print(f"[User] {sessions} charging session(s) active.")
            else:
                print("[System] Low Battery: Charging ports disabled.")

        # 4. IoT Data Upload (SIM800L GPRS)
        self.upload_iot_data(hour)
        
        print(f"Battery: {(self.current_charge_wh/self.battery_capacity_wh)*100:.1f}% | Solar: {generation:.1f}W")

    def upload_iot_data(self, hour):
        # Simulating the JSON payload described in docs
        payload = {
            "bench_id": "PARK-001",
            "battery_percent": round((self.current_charge_wh/self.battery_capacity_wh)*100, 2),
            "solar_watts": self.get_solar_input(hour),
            "gsm_signal": "Excellent" if self.gsm_connected else "None"
        }
        print(f"[SIM800L] Data Synced to Cloud: {payload}")

# Run 24-hour simulation
sim = SolarBenchSimulation()
for h in range(24):
    sim.simulate_hour(h)