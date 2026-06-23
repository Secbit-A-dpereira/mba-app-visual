export interface HelpContent {
  title: string
  purpose: string
  data: string
  fill: string
  interpret: string
}

export const HELP_CONTENT: Record<string, HelpContent> = {
  "1": {
    title: "Leadership",
    purpose: "Leadership is more than management. This tool helps you assess your leadership brand across 5 fundamentals: Strategy (vision), Execution, Talent Management, Talent Development, and Personal Proficiency.",
    data: "Your honest self-assessment ratings for each leadership dimension. Think about real situations — how you create vision, execute strategy, manage talent, develop people, and act with integrity.",
    fill: "Rate yourself 1-10 on each trait based on real situations, not where you want to be. Self-awareness is the first step to developing your leadership brand.",
    interpret: "Scores above 7 are strengths you can leverage as part of your leadership brand. Below 4 need development. Use the 5-step brand-building framework: nail down your results, define your desired descriptors, combine them into phrases, test your brand statement, then make it real."
  },
  "2": {
    title: "Corporate Financial Reporting",
    purpose: "Accounting is the language of business. This tool helps you analyze your company's financial health through the three core financial statements: Balance Sheet, Income Statement, and Cash Flow.",
    data: "Numbers from your financial statements: Revenue, COGS, Operating Expenses, Net Income, Assets, Liabilities, Equity, and Inventory levels.",
    fill: "Enter values from your latest financial statements. The Accounting Equation (Assets = Liabilities + Equity) is your foundation — everything else builds from here.",
    interpret: "Ratios compare to industry benchmarks. Gross margin > 40% is healthy for most industries. Current ratio > 1.5 indicates good liquidity."
  },
  "3": {
    title: "3M Framework",
    purpose: "Entrepreneurial Management is about solving unknown problems (pain) with unknown solutions (innovation). This framework helps you evaluate opportunities across three critical dimensions.",
    data: "Your assessment of: Market opportunity (size, growth, pain level), Management capability (team experience, skills), and Money viability (funding, revenue projections, unit economics).",
    fill: "Score each M from 1-10. Focus on finding deep customer pain — 'the deeper the pain, the greater the opportunity.' Look for makeshift solutions people have created in absence of your product.",
    interpret: "Average > 7 is a strong opportunity. Below 5 needs serious re-evaluation. Radar shows which dimension is weakest."
  },
  "4": {
    title: "Managerial Accounting (CVP)",
    purpose: "Managerial accounting helps internal decision-making. CVP analysis helps you understand how changes in cost affect operating income — essential for pricing and planning.",
    data: "Your unit economics: selling price per unit, variable cost per unit (materials, labor), and total fixed costs (rent, salaries, overhead).",
    fill: "Enter your unit economics and overhead. Use this example: $1 selling price, $0.75 variable cost, $10 fixed cost. Contribution margin = price - variable cost.",
    interpret: "Break-even = Fixed Costs ÷ (Price - Variable Cost per unit). Below break-even you lose money; above it you make profit. Activity-Based Costing helps surface what activities really cost."
  },
  "5": {
    title: "Business Finance",
    purpose: "Business finance focuses on optimal deployment of financial capital. Suboptimal use of capital leads to suboptimal use of resources, labor, and innovation.",
    data: "Initial investment cost, projected cash flows for each year, and your discount rate (reflecting risk and opportunity cost).",
    fill: "Enter the upfront investment and expected future cash flows. The discount rate accounts for risk — try 4% as an example. $100 now is worth more than $100 in 5 years.",
    interpret: "NPV > 0 means value creation. IRR > cost of capital = good investment. Payback < 3 years is attractive for most businesses."
  },
  "6": {
    title: "Marketing & Brand Ladder",
    purpose: "Marketing is about promoting products and services. First rule — you don't try to serve everybody. Segment the market, target a segment, then position the product.",
    data: "Your perception of your brand vs market perception. Customer insights from your 'love group' — fans who love your product.",
    fill: "Rate your brand and the market. Ask your biggest fans: what they like (feature), why they like it (benefit), why that matters (personal value). This laddering technique reveals your true positioning.",
    interpret: "Gaps between your brand and market perception reveal positioning opportunities. On a scale of 1-10, anything over 7 is a potential 'now' — people would buy it. Brands are impressions, not logos."
  },
  "7": {
    title: "Operations",
    purpose: "Operations management focuses on designing and controlling processes that produce goods and services. Efficiency and quality are the twin pillars.",
    data: "Operational data: production volume, quality/rework rates, downtime minutes, throughput, and efficiency metrics.",
    fill: "Enter your actual operational data. Track these metrics consistently to establish baselines before trying to improve them.",
    interpret: "OEE > 85% is world-class. 60-85% is typical. Below 60% needs improvement. Track trends over time."
  },
  "8": {
    title: "HR 9-Box Matrix",
    purpose: "Strategic Human Resource Management is about aligning your people strategy with business goals. The 9-Box grid helps visualize talent across performance and potential.",
    data: "Your team members' names and your assessment of their current performance and future potential.",
    fill: "Add each team member and rate their performance and potential on a 1-3 scale. Be honest and discuss ratings with other leaders for calibration.",
    interpret: "Top right (High Performer + High Potential) = Stars — promote and retain. Bottom right = Future Stars — invest in development. Bottom left = address performance issues directly."
  },
  "9": {
    title: "Business Negotiations",
    purpose: "Business Negotiations is about creating value through deals. Success comes from preparation — knowing your walkaway point and finding the zone of possible agreement.",
    data: "Your ideal outcome, your minimum acceptable deal, and your best estimate of the other party's range.",
    fill: "Define your reservation price (walkaway point) and target aspiration. Estimate the other party's range — the overlap is your ZOPA (Zone of Possible Agreement).",
    interpret: "If your ranges overlap, a deal is possible (ZOPA exists). Your BATNA (Best Alternative to a Negotiated Agreement) is your power — the stronger your alternatives, the more leverage you have. Always improve your BATNA before negotiating."
  },
  "10": {
    title: "Strategy (Porter/VRIO)",
    purpose: "Strategy is about positioning your company for long-term success. Porter's Five Forces analyzes industry attractiveness, while VRIO assesses your internal resources for competitive advantage.",
    data: "Your assessment of each of Porter's Five Forces (Threat of Entry, Supplier Power, Buyer Power, Substitutes, Rivalry) and your company's key assets for VRIO analysis.",
    fill: "Rate each of Porter's Five Forces. List company assets and assess their VRIO characteristics.",
    interpret: "High force ratings = less attractive industry. VRIO assets that are Valuable+Rare+Inimitable+Organized = sustained competitive advantage."
  },
  "11": {
    title: "Business Ethics",
    purpose: "Business Ethics is about making decisions that align with moral principles while serving stakeholders. Ethical frameworks help you navigate grey areas systematically.",
    data: "The ethical dilemma you're facing and the stakeholders involved. Your personal and organizational values.",
    fill: "Work through each question honestly. Consider who is affected, what principles are at stake, and what the consequences might be. Ethical leadership builds trust.",
    interpret: "The framework guides you through stakeholder analysis and consequence assessment. Use as a thinking tool, not a formula."
  },
  "12": {
    title: "Entrepreneurial Finance",
    purpose: "Entrepreneurial Finance is about managing the financial resources of a new venture. Startups face unique challenges — limited history, high uncertainty, and the constant risk of running out of cash.",
    data: "Your current cash position, monthly expenses (burn rate), monthly revenue, and customer acquisition metrics.",
    fill: "Enter your startup's numbers: cash in bank, monthly expenses, monthly revenue, and customer data. Cash is king — running out is the #1 cause of startup failure.",
    interpret: "Runway < 6 months = urgent fundraising. LTV:CAC > 3:1 is healthy. < 1:1 means you lose money per customer."
  },
  "13": {
    title: "Decision Making",
    purpose: "Judgment and Decision Making explores how cognitive biases affect business choices. Being aware of your biases is the first step to making better decisions.",
    data: "Honest self-reflection about which biases may be affecting your current business decisions.",
    fill: "Honestly assess which biases apply to your situation.",
    interpret: "More checked biases = higher decision risk. Use the checklist before major decisions to reduce blind spots."
  },
  "14": {
    title: "General Manager's 7S",
    purpose: "The General Manager's role is to orchestrate the entire organization. The 7S Framework (McKinsey) helps diagnose alignment between Strategy, Structure, Systems, Skills, Staff, Style, and Shared Values.",
    data: "Your assessment of your organization across all 7 dimensions of the McKinsey 7S framework.",
    fill: "Rate each dimension honestly. Misalignment between dimensions is where most organizational problems originate.",
    interpret: "Scores below 5 need attention. Misalignment between elements signals change management priorities. Shared Values should be the strongest."
  },
  "15": {
    title: "Blue Ocean (ERRC)",
    purpose: "Strategic Thinking is about creating new market space rather than competing in existing ones. The ERRC Grid helps you build a Blue Ocean strategy.",
    data: "List of factors your industry competes on, and your ideas for changing them.",
    fill: "Think about what your industry takes for granted (Eliminate), what can be reduced below standard (Reduce), what should be raised above competitors (Raise), and what's never been offered (Create).",
    interpret: "Your new value curve should diverge from the industry average. The more unique your combination of Eliminate, Reduce, Raise, and Create, the more likely you've found a Blue Ocean."
  },
  "16": {
    title: "Creativity (SCAMPER)",
    purpose: "SCAMPER provides a structured approach to creative thinking by asking 7 types of questions about your product or process.",
    data: "The product, service, or process you want to innovate on.",
    fill: "For each SCAMPER category: Substitute (replace components), Combine (merge), Adapt (modify for new use), Modify (change attributes), Put to other use (new applications), Eliminate (remove elements), Reverse (flip or invert).",
    interpret: "Each category stimulates different types of thinking. The most innovative solutions come from combining ideas across categories. Don't judge during generation — capture everything, then evaluate."
  },
  "17": {
    title: "Startup Marketing",
    purpose: "Startup Marketing is different from traditional marketing — you're often creating a new category. Focus on finding product-market fit before scaling.",
    data: "Market size estimates, current reach and conversion metrics, and viral growth parameters.",
    fill: "Enter your TAM (Total Addressable Market), current reach, and funnel metrics. Startups should focus on a narrow beachhead before expanding.",
    interpret: "Viral coefficient > 1.0 = exponential growth. B2B SaaS conversion benchmark: 2-5%."
  },
  "18": {
    title: "Balanced Scorecard",
    purpose: "Performance and Incentives are about aligning individual behavior with organizational goals. The Balanced Scorecard translates strategy into operational terms across 4 perspectives.",
    data: "Your strategic objectives, key performance indicators, target values, and current performance across all 4 scorecard perspectives.",
    fill: "Define 2-3 objectives per perspective with measurable KPIs. Set realistic but aspirational targets. What gets measured gets managed — choose metrics that drive the right behaviors.",
    interpret: "Balance across all 4 perspectives. On-track items show progress; at-risk items need attention."
  },
  "19": {
    title: "CAGE Distance",
    purpose: "Global Management is about operating across borders. The CAGE Distance Framework helps assess the friction between countries across Cultural, Administrative, Geographic, and Economic dimensions.",
    data: "Your home country and target country for expansion, and your assessment of each CAGE dimension.",
    fill: "Rate the distance between your home country and target country for each dimension. Cultural: language, values. Administrative: laws, policies. Geographic: distance, time zones. Economic: wealth, infrastructure.",
    interpret: "Higher scores = more expansion friction. Countries with low CAGE distance are easier entry points. Start with culturally and geographically close markets before expanding further."
  },
  "21": {
    title: "RevOps Launch Readiness",
    purpose: "Ensure cross-functional alignment and eliminate gaps before launching a new product. Success is built on two-way accountability across Sales, Marketing, Product, Customer Success, and Finance.",
    data: "Assessment ratings (1-5) for pre-launch checklist items covering all functional departments.",
    fill: "Rate each readiness task from 1 to 5. Scores below 3 represent high-risk flags that must be resolved before proceeding with the launch.",
    interpret: "An overall score of >80% with zero risk flags indicates high launch readiness. Risk flags highlight immediate operational gaps (e.g., lack of team training, missing tracking, or billing errors)."
  },
  "22": {
    title: "Pipeline & Forecast",
    purpose: "Track the health of the launch pipeline and forecast final revenue targets with high confidence. RevOps helps run a predictable revenue machine by ensuring deals progress reliably through stages.",
    data: "Deal amounts for each pipeline stage and the historical or expected probability coefficients per stage, along with current actual closed-won figures.",
    fill: "Enter the deal size for each stage (Awareness to Closed) and adjust probability percentages. Enter target forecast and actual closed amounts to see variance.",
    interpret: "Weighted pipeline represents the statistically expected launch revenue. A low weighted pipeline relative to the target suggests pipeline gaps. A high forecast accuracy indicates stable deal velocity."
  },
  "23": {
    title: "Customer Journey Map",
    purpose: "Map out the complete end-to-end customer lifecycle to ensure continuity, eliminate friction points, and assign clear departmental ownership.",
    data: "Key customer touchpoints, tracking metrics, departmental owners, statuses, and qualitative scores for each stage.",
    fill: "For each of the six lifecycle stages, document the active touchpoints, specific metrics, owner, status, and rate current performance 1-5.",
    interpret: "Qualitative assessment averages map the customer experience health. A steep drop-off or low rating in early stages highlights onboarding and retention leaks that must be plugged immediately."
  },
  "24": {
    title: "GTM Launch Plan",
    purpose: "Orchestrate annual go-to-market strategies by bridging top-down targets with bottom-up capacity planning, budgeting, channel allocations, and milestone tracking.",
    data: "Market size values (TAM, SAM, SOM), channel percentages, department budget allocations, and timelines.",
    fill: "Toggle between Top-Down and Bottom-Up planning. Define TAM, SAM, SOM. Set percentages for channel distributions and allocate budgets across teams. Outline phases and weeks.",
    interpret: "Reconcile TAM/SAM/SOM to ensure the market can support target goals. The channel and budget distributions show where capital is deployed to maximize return on investment (ROI)."
  },
  "25": {
    title: "Revenue Dashboard",
    purpose: "Provide a single source of truth for the launch metrics, month-on-month trend tracking, and leading indicators compared against industry benchmarks.",
    data: "Monthly values for Revenue, ARR, and Churn, along with current metrics for NRR, LTV:CAC, and Payback compared to standard targets.",
    fill: "Fill in the month-by-month financial values. Update leading indicator metrics and input your current metrics to view the benchmark comparison.",
    interpret: "Benchmark comparisons highlight operational health (e.g., LTV:CAC > 3x, NRR > 110%). Leading indicators predict future revenue performance, while trailing trends verify growth sustainability."
  },
  "26": {
    title: "Operating Cadences",
    purpose: "Blueprint consistent, disciplined routines that bring GTM teams together to review performance, align goals, and solve problems collaboratively.",
    data: "Meeting parameters for major business reviews: frequency, duration, attendees, agendas, and qualitative effectiveness scores.",
    fill: "Specify attendees, agenda items, duration, and frequency for the core cadences. Score each meeting's effectiveness from 1 to 5.",
    interpret: "Consistent cadences prevent misalignment. Low effectiveness scores (<3) indicate meetings that have devolved into 'reading the news' rather than solving actual deals or alignment blocks."
  },
  "27": {
    title: "Activity-Based Costing",
    purpose: "Distribute overhead costs to products based on their actual consumption of operational activities to reveal true product profitability.",
    data: "Indirect cost pools, activity drivers, and resource consumption details for standard, premium, and custom products.",
    fill: "Define the cost of each activity pool. Enter direct materials, direct labor, and the specific driver units consumed by each product.",
    interpret: "Comparing ABC to traditional costing exposes cost distortions. Standard high-volume products are often overcosted, while complex, low-volume custom products are undercosted."
  },
  "28": {
    title: "Variance Analysis",
    purpose: "Compare actual financial performance against standard plans using flexible budgets to isolate price, rate, and usage inefficiencies.",
    data: "Standard units, pricing, materials, labor, and overhead parameters alongside actual production quantities and expenditures.",
    fill: "Set standards for labor, material, and overhead. Enter actual costs and volumes to compute detailed price and efficiency variances.",
    interpret: "Favorable variances indicate efficiency or lower costs. Unfavorable variances point to spending overruns. Variances >10% are flagged as exceptions for immediate operational review."
  },
  "29": {
    title: "Pricing & Decisions",
    purpose: "Analyze pricing strategies and short-term tactical choices: cost-plus markups, target costs, make-vs-buy, special orders, and product mix optimization.",
    data: "Product costs, target markup, market pricing, supplier offers, special order volumes, and bottleneck capacity constraints.",
    fill: "Input relevant unit costs, markups, market target prices, special contract terms, and product contribution margins alongside bottleneck capacity limits.",
    interpret: "Use clear go/no-go cards to decide: outsource when supplier price is below relevant in-house costs, accept special orders priced above incremental variable costs, and prioritize products with high contribution margin per bottleneck hour."
  },
  "30": {
    title: "Positioning Strategy Wizard",
    purpose: "Get a personalized positioning strategy based on the 22 Immutable Laws of Marketing. Answer 6 key questions about your product/market to receive actionable recommendations.",
    data: "Your answers to six strategic questions: Are you first? Can you create a new category? What is your market position? Do you own a unique word? Is your market mature? Do you have adequate funding?",
    fill: "Select the option that best describes your situation for each question. Be honest—the tool uses your answers to apply the relevant marketing laws.",
    interpret: "The recommended strategy is based on the laws that apply to your situation. Use the action items to refine your positioning. The positioning map shows your relative position on market maturity vs. uniqueness."
  }
}
