import streamlit as st
import pandas as pd
import os
import textwrap
from datetime import datetime
import streamlit.components.v1 as components
from utils import convert_height_to_meters, convert_weight_to_kg, calculate_bmi, get_standard_category, get_sbmi_interpretation
from viewer_3d import get_3d_viewer_html

# ====================================================
# CONFIGURATION & SETUP
# ====================================================
st.set_page_config(
    page_title="Anguin - Advanced SBMI",
    page_icon="🐧",
    layout="wide",
    initial_sidebar_state="collapsed"
)

HISTORY_FILE = "bmi_history.csv"

# ====================================================
# CUSTOM CSS
# ====================================================
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

    /* BASE STYLES - GRAVITY THEME */
    html, body, [class*="css"] {
        font-family: 'Outfit', sans-serif;
        color: #e0e0e0;
    }
    
    /* ANIMATED DEEP SPACE BACKGROUND */
    .stApp {
        background: linear-gradient(-45deg, #0b0f19, #1b1e44, #2d1b4e, #0b0f19);
        background-size: 400% 400%;
        animation: gravityGradient 20s ease infinite;
    }
    
    @keyframes gravityGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    /* GLASSMORPHISM CARD - DARK MODE */
    .glass-container {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
        padding: 40px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        margin-bottom: 25px;
    }
    
    /* TABS */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 5px 10px;
        border-radius: 100px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .stTabs [data-baseweb="tab"] {
        height: 45px;
        background-color: transparent;
        border-radius: 100px;
        color: #e5e7eb; /* Light Grey/White text for visibility */
        font-weight: 600;
        border: none;
        padding: 0 20px;
        transition: all 0.3s;
    }
    .stTabs [aria-selected="true"] {
        background-color: rgba(255, 255, 255, 0.1) !important;
        color: #22d3ee !important; /* Cyan Neon */
        box-shadow: 0 0 15px rgba(34, 211, 238, 0.3);
        border: 1px solid rgba(34, 211, 238, 0.2);
    }
    
    /* WIDGET STYLING */
    /* Input Fields & Selectboxes */
    div[data-baseweb="input"] > div, div[data-baseweb="select"] > div {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-radius: 12px !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: #f3f4f6 !important;
    }
    div[data-baseweb="input"] > div:focus-within, div[data-baseweb="select"] > div:focus-within {
        border-color: #c084fc !important; /* Purple Neon */
        box-shadow: 0 0 0 2px rgba(192, 132, 252, 0.2) !important;
    }
    
    /* DROPDOWN MENU FIX - V3 (Aggressive Override) */
    ul[data-baseweb="menu"], 
    div[data-baseweb="popover"] div, 
    div[data-baseweb="popover"] ul {
        background-color: #ffffff !important; /* White Background */
        border-radius: 15px !important;
    }

    li[data-baseweb="menu-item"] {
        background-color: transparent !important;
    }
    
    /* Target EVERY possible text container inside the dropdown */
    li[data-baseweb="menu-item"] div,
    li[data-baseweb="menu-item"] span,
    li[data-baseweb="menu-item"] p,
    div[data-baseweb="popover"] div,
    div[data-baseweb="popover"] span {
        color: #000000 !important; /* Force Black Text */
        font-weight: 600 !important;
    }
    
    /* Hover State */
    li[data-baseweb="menu-item"]:hover, 
    li[data-baseweb="menu-item"][aria-selected="true"] {
        background-color: #f3f4f6 !important;
    }
    
    /* Ensure the selected item in the list is also black */
    li[data-baseweb="menu-item"][aria-selected="true"] * {
        color: #000000 !important;
    }
    
    /* Override internal text colors if needed */
    div[data-baseweb="select"] div {
        color: #e0e0e0 !important;
    }
    
    /* Sliders */
    div[data-baseweb="slider"] div[role="slider"] {
        background-color: #22d3ee !important;
        box-shadow: 0 0 10px rgba(34, 211, 238, 0.6);
    }
    div[data-baseweb="slider"] div[data-testid="stTickBar"] {
        background: linear-gradient(90deg, #c084fc 0%, #22d3ee 100%);
    }

    /* Buttons */
    div.stButton > button {
        background: linear-gradient(90deg, #7c3aed 0%, #db2777 100%);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 12px;
        font-weight: 700;
        letter-spacing: 1px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(219, 39, 119, 0.4);
        width: 100%;
        text-transform: uppercase;
    }
    div.stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(219, 39, 119, 0.6);
    }

    /* HEADERS & LABELS */
    h1 { 
        background: linear-gradient(to right, #22d3ee, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800 !important;
    }
    h2, h3 { color: #f3f4f6 !important; }
    p, label { color: #d1d5db !important; }
    
    .stRadio label { color: #e5e7eb !important; }
    .stCheckbox label { color: #e5e7eb !important; }
    
    /* PRIVACY NOTICE */
    .privacy-notice {
        background: rgba(34, 211, 238, 0.05); 
        padding: 15px; 
        border-radius: 12px; 
        border-left: 4px solid #22d3ee;
        font-size: 0.85rem;
        color: #a5f3fc;
    }

    /* TEAM CARD & LISTS */
    .clean-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 25px;
        color: #e0e0e0;
    }
    li, strong { color: #e0e0e0 !important; }
    ul { color: #e0e0e0 !important; }
    
    h4 { color: #22d3ee !important; } /* Fix Visibility for H4 headers */
    
</style>
""", unsafe_allow_html=True)

# ====================================================
# HELPER FUNCTIONS
# ====================================================
def save_log(data):
    df = pd.DataFrame([data])
    if os.path.exists(HISTORY_FILE):
        pd.concat([pd.read_csv(HISTORY_FILE), df]).to_csv(HISTORY_FILE, index=False)
    else:
        df.to_csv(HISTORY_FILE, index=False)

def clear_logs():
    if os.path.exists(HISTORY_FILE):
        os.remove(HISTORY_FILE)

# ====================================================
# MAIN APP
# ====================================================

# Load and Encode Logo
import base64
def get_base64_image(image_path):
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode()
    except Exception:
        return ""

logo_path = "anguin_logo_round.jpg"
encoded_logo = get_base64_image(logo_path)

if encoded_logo:
    img_tag = f'<img src="data:image/jpeg;base64,{encoded_logo}" style="width: 85px; height: 85px; border-radius: 50%; object-fit: cover; border: 3px solid #22d3ee; box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);">'
else:
    img_tag = '<div style="font-size: 50px;">🐧</div>'

# Custom Header with Flexbox for perfect alignment
st.markdown(f"""
<div style="display: flex; align-items: center; gap: 25px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
    {img_tag}
    <div style="display: flex; flex-direction: column; justify-content: center;">
        <h1 style="margin: 0; padding: 0; font-size: 3rem; font-weight: 800; background: linear-gradient(to right, #22d3ee, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Anguin</h1>
        <p style="margin: 5px 0 0 0; color: #e5e7eb; font-size: 1.1rem; font-weight: 500; letter-spacing: 0.5px;">Advanced SBMI Calculator <span style="color: #6b7280;">|</span> Contextual Health Analytics</p>
    </div>
</div>
""", unsafe_allow_html=True)



# TABS
tab_calc, tab_info, tab_hist, tab_team = st.tabs(["🧮 Calculator", "📘 SBMI – Read More", "📜 History", "👥 Team"])

# --- CALCULATOR TAB ---
with tab_calc:
    col_input, col_result = st.columns([1, 1.2])
    
    with col_input:
        st.markdown("### 1. Your Profile")
        with st.container():
            # Unit Selection
            units = st.radio("Units", ["Metric (cm / kg)", "Imperial (ft / lb)"], horizontal=True, key="units_radio")
            
            # --- SESSION STATE & CALLBACKS FOR SYNC ---
            if "h_cm_val" not in st.session_state: st.session_state.h_cm_val = 170
            if "w_kg_val" not in st.session_state: st.session_state.w_kg_val = 70.0
            if "w_lb_val" not in st.session_state: st.session_state.w_lb_val = 150.0

            def sync_h_cm_slider(): st.session_state.h_cm_val = st.session_state.slider_h_cm
            def sync_h_cm_input(): st.session_state.h_cm_val = st.session_state.input_h_cm
            
            def sync_w_kg_slider(): st.session_state.w_kg_val = st.session_state.slider_w_kg
            def sync_w_kg_input(): st.session_state.w_kg_val = st.session_state.input_w_kg
            
            def sync_w_lb_slider(): st.session_state.w_lb_val = st.session_state.slider_w_lb
            def sync_w_lb_input(): st.session_state.w_lb_val = st.session_state.input_w_lb

            
            # Basic Inputs
            c1, c2 = st.columns(2)
            with c1:
                age = st.number_input("Age", min_value=2, max_value=120, value=25, key="input_age")
            with c2:
                gender = st.selectbox("Gender", ["Male", "Female"], key="input_gender")
            
            # Height & Weight (Dynamic based on Units)
            height_m = 0.0
            weight_kg = 0.0
            
            if "Metric" in units:
                c_h, c_w = st.columns(2)
                with c_h:
                    st.caption("Height (cm)")
                    h_cm = st.number_input("Height Input", label_visibility="collapsed", step=1, min_value=50, max_value=300, key="input_h_cm", value=st.session_state.h_cm_val, on_change=sync_h_cm_input)
                    st.slider("Height Slider", 100, 250, key="slider_h_cm", label_visibility="collapsed", value=st.session_state.h_cm_val, on_change=sync_h_cm_slider)
                    height_m = convert_height_to_meters(feet=0, cm=st.session_state.h_cm_val, system="Metric")
                with c_w:
                    st.caption("Weight (kg)")
                    w_input = st.number_input("Weight Input", label_visibility="collapsed", step=0.1, min_value=10.0, max_value=300.0, key="input_w_kg", value=st.session_state.w_kg_val, on_change=sync_w_kg_input)
                    st.slider("Weight Slider", 30.0, 150.0, key="slider_w_kg", label_visibility="collapsed", value=st.session_state.w_kg_val, on_change=sync_w_kg_slider)
                    weight_kg = st.session_state.w_kg_val
            else:
                c_h1, c_h2 = st.columns(2)
                with c_h1:
                    ft = st.number_input("Height (Feet)", value=5, step=1, min_value=1, max_value=9, key="input_h_ft")
                with c_h2:
                    inc = st.number_input("Inches", value=9, step=1, min_value=0, max_value=11, key="input_h_in")
                height_m = convert_height_to_meters(feet=ft, inches=inc, system="Imperial")
                
                c_w1, c_w2 = st.columns([2, 1])
                with c_w1:
                    # Choice for Stones or Lbs
                    w_type = st.selectbox("Weight Type", ["Pounds (lbs)", "Stones (st)"], label_visibility="collapsed", key="input_w_type")
                with c_w2:
                    pass 
                
                if "Pounds" in w_type:
                    st.caption("Weight (lbs)")
                    w_lb = st.number_input("Weight Input", label_visibility="collapsed", step=0.1, min_value=10.0, max_value=500.0, key="input_w_lb", value=st.session_state.w_lb_val, on_change=sync_w_lb_input)
                    st.slider("Weight Slider", 70.0, 350.0, key="slider_w_lb", label_visibility="collapsed", value=st.session_state.w_lb_val, on_change=sync_w_lb_slider)
                    weight_kg = convert_weight_to_kg(st.session_state.w_lb_val, unit="lb")
                else:
                    c_st1, c_st2 = st.columns(2)
                    with c_st1: w_st = st.number_input("Stones", value=10, step=1, min_value=1, max_value=100, key="input_w_st")
                    with c_st2: w_st_lb = st.number_input("Lbs", value=0, step=1, min_value=0, max_value=13, key="input_w_st_lb")
                    weight_kg = convert_weight_to_kg(w_st, w_st_lb, unit="st")

            st.write("---")
            st.markdown("### 2. Context (Optional)")
            
            # Replaced single checkbox with granular Ethnicity selection
            ethnicity = st.selectbox(
                "Ethnicity (Context for Diabetes Risk)", 
                ["White / European", "South Asian", "Black", "Chinese", "Arab", "Other / Mixed", "Asian (Other)"],
                index=0,
                help="Different ethnicities have different risk profiles for diabetes at the same BMI."
            )
            
            diet_hist = st.selectbox("Diet History", [
                "No, never",
                "More than a year ago",
                "For a few months in the past",
                "Yes, currently"
            ], key="input_diet_hist")
            
            diet_type = "N/A"
            if diet_hist == "Yes, currently":
                diet_type = st.selectbox("Diet Type", [
                    "Low-carb / Ketogenic",
                    "Low-fat",
                    "Calorie reduction",
                    "Fasting",
                    "Other"
                ], key="input_diet_type")
            
            target_w = st.number_input("Target Weight (Goal)", value=0.0, min_value=0.0, key="input_target_w")

    with col_result:
        st.markdown("### 3. Analysis")
        
        # 3D VISUALIZATION (Embedded in Analysis Box)
        MODEL_PATH = "nathan_model/rp_nathan_animated_003_walking.fbx"
        if os.path.exists(MODEL_PATH):
            html_3d = get_3d_viewer_html(MODEL_PATH)
            # Use smaller height to fit nicely in the card/column
            components.html(html_3d, height=400, scrolling=False)
        
        calc_btn = st.button("Calculate SBMI ➝", type="primary", use_container_width=True)
        
        if calc_btn:
            # Calculation
            if height_m > 0:
                bmi = calculate_bmi(weight_kg, height_m)
                std_cat, std_color = get_standard_category(bmi)
                
                # Pass plain string for ethnicity logic
                eth_key = ethnicity.split(" / ")[0] # "South Asian", "White", "Black" etc.
                if "Asian (Other)" in ethnicity: eth_key = "Asian (Other)"
                
                sbmi_cat, sbmi_color, (sbmi_min, sbmi_max) = get_sbmi_interpretation(bmi, age, gender, eth_key)
                
                # SBMI Range Calculation (Ideal Weight)
                ideal_w_min = sbmi_min * (height_m**2)
                ideal_w_max = sbmi_max * (height_m**2)
                
                # Display Results
                # Display Results
                html_result = (
                    f'<div class="glass-container" style="padding: 30px; text-align: center;">'
                    f'    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">'
                    f'        <div style="text-align: left;">'
                    f'            <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF;">SBMI Result</span>'
                    f'            <div style="font-size: 3.5rem; font-weight: 800; background: -webkit-linear-gradient(0deg, {sbmi_color}, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{bmi:.1f}</div>'
                    f'        </div>'
                    f'        <div style="background: {sbmi_color}20; border: 1px solid {sbmi_color}; color: {sbmi_color}; padding: 10px 20px; border-radius: 50px; font-weight: 700;">'
                    f'            {sbmi_cat}'
                    f'        </div>'
                    f'    </div>'
                    f'    <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin-top: 20px;">'
                    f'        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">'
                    f'            <span style="color: #9CA3AF; font-size: 0.9rem;">Standard BMI Category</span>'
                    f'            <span style="font-weight: 600; color: {std_color};">{std_cat}</span>'
                    f'        </div>'
                    f'        <div style="display: flex; justify-content: space-between;">'
                    f'            <span style="color: #9CA3AF; font-size: 0.9rem;">Healthy Weight Range</span>'
                    f'            <span style="font-weight: 600; color: #34D399;">{ideal_w_min:.1f} - {ideal_w_max:.1f} kg</span>'
                    f'        </div>'
                    f'    </div>'
                    f'</div>'
                )
                st.markdown(html_result, unsafe_allow_html=True)
                
                st.caption(f"*Interpretation adjusted for: {gender}, Age {age}, {ethnicity}*")
                
                # Save Log
                log_data = {
                    "Date": datetime.now().strftime("%Y-%m-%d %H:%M"),
                    "Height (m)": round(height_m, 2),
                    "Weight (kg)": round(weight_kg, 1),
                    "BMI": round(bmi, 2),
                    "Standard Cat": std_cat,
                    "SBMI Cat": sbmi_cat,
                    "Diet": diet_type if diet_hist == "Yes, currently" else "None"
                }
                save_log(log_data)
                
            else:
                st.error("Height must be greater than 0.")
        else:
            st.info("Enter your details and click Calculate to see your Smart BMI analysis.")

        st.markdown("---")
        st.markdown("---")
        st.markdown("""
        <div class="privacy-notice">
            <strong>🔒 Privacy Notice</strong><br>
            All data entered here is processed directly in your local environment. No data is sent to any external server. Your health information remains private.
        </div>
        """, unsafe_allow_html=True)


# --- INFO TAB ---
with tab_info:
    st.markdown("### About Smart BMI (SBMI)")
    st.markdown("""
    **Standard BMI** is a useful screening tool but has limitations. It doesn't account for:
    - **Age**: Older adults often need slightly more weight reserves to protect against frailty.
    - **Ethnicity**: Asian populations often have higher health risks at lower BMI thresholds (e.g., diabetes risk rises at BMI 23).
    - **Gender**: Body composition differs between men and women.

    **SBMI (Smart BMI)** in this application applies **Targeted Adjustments** derived from research such as *The Global BMI Mortality Collaboration (Lancet 2016)* and WHO guidelines.

    #### Adjustments Applied:
    1.  **Asian Ethnicity**: 
        -   Overweight threshold lowered to **23.0** (Standard is 25.0).
        -   Obese threshold lowered to **27.5** (Standard is 30.0).
    2.  **Seniors (>65 years)**:
        -   "Underweight" threshold raised to **22.0**.
        -   Optimal range shifts upwards to account for protective health benefits of moderate weight in aging.
    """)

# --- HISTORY TAB ---
with tab_hist:
    c_h1, c_h2 = st.columns([4, 1])
    with c_h1: st.subheader("Calculation Logs")
    with c_h2: 
        if st.button("Clear History"):
            clear_logs()
            st.rerun()
            
    if os.path.exists(HISTORY_FILE):
        st.dataframe(pd.read_csv(HISTORY_FILE).sort_index(ascending=False), use_container_width=True)
    else:
        st.info("No logs found.")

# --- TEAM TAB ---
with tab_team:
    st.subheader("Project Team")
    st.markdown("""
    <div class="clean-card">
        <h3>Team Lead</h3>
        <p><strong>Sagar Bhadravathi Ravi</strong> 📧 <a href="mailto:sagar.br0510@gmail.com" style="color: #22d3ee; text-decoration: none;">Contact</a></p>
        <hr>
        <h3>Team Members</h3>
        <ul style="list-style-type: none; padding: 0;">
            <li>Nane Aleksanyan</li>
            <li>Gevorg Harutyunyan</li>
            <li>Parvathy Velakketh Ajayagosh</li>
            <li>Abdullasiyad Thoppil</li>
            <li>Giorgi Andriashvili</li>
            <li>Mohammad Rashid Kannachenthodi</li>
            <li>Aneeshya Dasappan</li>
            <li>Rehaan Rithwan</li>
            <li>Leo Thomas</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)



# ====================================================
# FOOTER
# ====================================================
st.markdown("""
<style>
    .footer {
        position: fixed;
        bottom: 10px;
        right: 15px;
        font-size: 0.8rem;
        color: #6b7280;
        z-index: 1000;
        font-family: 'Outfit', sans-serif;
        background: rgba(0,0,0,0.5);
        padding: 5px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.05);
    }
</style>
<div class="footer">
    by srk-brk-tech
</div>
""", unsafe_allow_html=True)
