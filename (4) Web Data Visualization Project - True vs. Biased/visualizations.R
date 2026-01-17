library(tidyverse)

data <- read_csv("~/DAT-230/Final Case Study/Electric_Vehicle_Population_Data.csv")

# Overview of data set, used to check datatypes of features
# Features do not have unreasonable typing, so no changes needed to be made there
data %>% glimpse()

# Dropped rows with missing values. 639 rows were removed. 
data <- drop_na(data)

# The Electric Utility column had multiple entries within one observation, delimited by either "||" or "|"
# To make it easier to analyze later, it was broken into primary and other
# Primary - The first value in the string, Other - Every other value after the first delimiter
data <- data %>% 
  separate(`Electric Utility`,
           into = c("Primary Electric Utility", "Other Electric Utility"),
           sep = "\\|\\||\\|",
           extra = "merge") %>%
  mutate(`Other Electric Utility` = str_replace_all(`Other Electric Utility`, "\\|\\||\\|", ", ")) %>%
  mutate(`Other Electric Utility` = str_replace_na(`Other Electric Utility`, replacement = "None"))

# Print the csv
#write_csv(data, "Final_Project_Data.csv")

data <- data %>% 
  filter(`Electric Range` != 0)

# Plot Creation - Honest 1
avg_erng_years_ev <- data %>%
  filter(`Electric Vehicle Type` == "Battery Electric Vehicle (BEV)") %>%
  group_by(`Model Year`) %>%
  summarise("Average Electric Range" = mean(`Electric Range`), "Vehicle Type" = "Battery Electric Vehicle (BEV)")

plot1 <- avg_erng_years_ev %>% ggplot(aes(x=`Model Year`, y =`Average Electric Range`)) + 
  geom_line(linewidth = 2, color = "blue") + 
  labs(title = "Average Electric Range Of Vehicles By Model Year",
       subtitle = "Early 2010s EVs have worse range than those produced both earlier and later",
       y = "Average Electric Range (miles)",
       x = "Model Year") +
  theme_minimal() +
  theme(plot.title = element_text(size = 17, face = "bold", hjust = 0.5, family = "Arial"),
        plot.subtitle = element_text(size = 11, hjust = 0.5, color = "gray30", family = "Arial"),
        axis.text = element_text(size = 11, family = "Arial"),
        axis.title = element_text(size = 12, face = "bold", family = "Arial"),
        plot.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.grid.major.y = element_blank())
print(plot1)

# Plot Creation - Biased 1
avg_erng_years_biased <- avg_erng_years_ev %>%
  filter(`Model Year` < 2016)

plot1 <- avg_erng_years_biased %>% ggplot(aes(x=`Model Year`, y =`Average Electric Range`,
                                              group=`Vehicle Type`, color=`Vehicle Type`)) + 
  geom_line(linewidth = 2, color = "blue") + 
  labs(title = "Average Electric Range Of Vehicles By Model Year",
       subtitle = "Older is Better: EV ranges have regressed since 2010",
       y = "Average Electric Range (miles)",
       x = "Model Year") +
  theme_minimal() +
  theme(plot.title = element_text(size = 17, face = "bold", hjust = 0.5, family = "Arial"),
        plot.subtitle = element_text(size = 11, hjust = 0.5, color = "gray30", family = "Arial"),
        axis.text = element_text(size = 11, family = "Arial"),
        axis.title = element_text(size = 12, face = "bold", family = "Arial"),
        plot.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.grid.major.y = element_blank())
print(plot1)

# Plot Creation - Honest 2
brand_range <- data %>%
  filter(`Electric Range` > 0) %>%
  filter(`Electric Vehicle Type` == "Battery Electric Vehicle (BEV)") %>%
  group_by(`Make`) %>%
  summarise(best_range = max(`Electric Range`)) %>%
  arrange(desc(best_range))

ggplot(brand_range, aes(x = reorder(Make, best_range), y = best_range)) +
  geom_col(fill = "steelblue") +
  coord_flip() +
  labs(title = "Best EV Range by Brand",
       subtitle = "Tesla and Porsche have a range significantly higher than all the rest",
       x = "Brand",
       y = "Range (miles)") +
  theme_minimal() +
  theme(plot.title = element_text(size = 17, face = "bold", hjust = 0.5, family = "Arial"),
        plot.subtitle = element_text(size = 11, hjust = 0.5, color = "gray30", family = "Arial"),
        axis.text = element_text(size = 11, family = "Arial"),
        axis.title = element_text(size = 12, face = "bold", family = "Arial"),
        plot.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.grid.major.y = element_blank())

# Plot Creation - Biased 2
brands_to_keep <- c("TESLA", "VOLKSWAGEN", "MINI", "TOYOTA", "TH!NK", "FORD", "MERCEDES-BENZ",
                    "FIAT", "SMART", "MITSUBISHI", "AZURE DYNAMICS")

brand_range_biased <- brand_range %>% filter(Make %in% brands_to_keep)

ggplot(brand_range_biased, aes(x = reorder(Make, best_range), y = best_range)) +
  geom_col(fill = "steelblue") +
  coord_flip() +
  labs(title = "Best EV Range by Brand",
       subtitle = "Tesla vehicles have the longest range by far of the EVs in Washington State",
       x = "Brand",
       y = "Range (miles)") +
  theme_minimal() +
  theme(plot.title = element_text(size = 17, face = "bold", hjust = 0.5, family = "Arial"),
        plot.subtitle = element_text(size = 11, hjust = 0.5, color = "gray30", family = "Arial"),
        axis.text = element_text(size = 11, family = "Arial"),
        axis.title = element_text(size = 12, face = "bold", family = "Arial"),
        plot.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.grid.major.y = element_blank())

# Plot Creation - Honest 3
makes_data <- data %>%
  count(Make) %>%
  mutate(group_pct = (n/sum(n)) * 100) %>%
  mutate(Make = ifelse(group_pct < 5, "Other", Make)) %>%
  group_by(Make) %>%
  summarise(count = sum(n)) %>%
  mutate(Percentage = round((count / sum(count)) * 100))


ggplot(makes_data, aes(x="", y=count, fill = Make)) +
  geom_bar(stat="identity", width = 1) +
  coord_polar("y") +
  geom_text(aes(label = paste0(Percentage, "%")),
            position = position_stack(vjust = 0.5),
            color = "white", size = 5) +
  theme_void() +
  theme(plot.title = element_text(size = 18, face = "bold", hjust = 0.5),
        plot.subtitle = element_text(size = 12, hjust = 0.5, color = "gray30"),
        legend.position = "bottom",
        legend.text = element_text(size = 12),
        legend.title = element_blank()) +
  labs(title = "EV Production Not A One-Size-Fits-All", 
       subtitle = "Significant presence of companies, each making their own unique versions of an EV")


# Plot Creation - Biased 3
# Count by brand - Tesla vs all others combined
brand_simple <- data %>%
  mutate(brand_group = ifelse(Make == "TESLA", "Tesla", "All Other Brands Combined")) %>%
  count(brand_group) %>%
  mutate(percentage = round(n / sum(n) * 100, 1))

# Simple pretty pie chart
ggplot(brand_simple, aes(x = "", y = n, fill = brand_group)) +
  geom_bar(stat = "identity", width = 1, color = "white", size = 3) +
  coord_polar("y") +
  scale_fill_manual(values = c("Tesla" = "#E31937", 
                               "All Other Brands Combined" = "#4A90E2")) +
  geom_text(aes(label = paste0(percentage, "%")), 
            position = position_stack(vjust = 0.5),
            color = "white", size = 8, fontface = "bold") +
  labs(title = "Tesla Controls A Quarter of All EV Sales",
       subtitle = "Concerning market concentration in electric vehicle industry") +
  theme_void() +
  theme(plot.title = element_text(size = 18, face = "bold", hjust = 0.5),
        plot.subtitle = element_text(size = 12, hjust = 0.5, color = "gray30"),
        legend.position = "bottom",
        legend.text = element_text(size = 12),
        legend.title = element_blank())

# Plot Creation - Honest 4
ev_by_utility <- data %>%
  group_by(`Primary Electric Utility`) %>%
  summarise(count = n()) %>%
  arrange(desc(count)) %>%
  head(3)

ggplot(ev_by_utility, aes(x = reorder(`Primary Electric Utility`, count), y = `count`, 
                          fill = `Primary Electric Utility`)) +
  geom_bar(stat = "identity") +
  scale_fill_discrete() +
  labs(title = "Top 3 Electric Utility Providers in Washington State",
       subtitle = "Although the top 3, there exists a significant margin between first and second",
       x = "Provider",
       y = "Number of EVs In Region") +
  theme_minimal() +
  theme(plot.title = element_text(size = 16, face = "bold", hjust = 0.5, family = "Arial"),
        plot.subtitle = element_text(size = 11, hjust = 0.5, color = "gray30", family = "Arial"),
        axis.text = element_text(size = 10, family = "Arial"),
        axis.title = element_text(size = 12, face = "bold", family = "Arial"),
        axis.text.x = element_text(),
        legend.position = "none",
        plot.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.background = element_rect(fill = "#F5F5F5", color = NA))

# Plot Creation - Biased 4
ggplot(ev_by_utility, aes(x = reorder(`Primary Electric Utility`, count), y = `count`, 
                          fill = `Primary Electric Utility`)) +
  geom_bar(stat = "identity") +
  scale_fill_discrete() +
  coord_cartesian(ylim = c(18000, 55000)) +
  labs(title = "Top 3 Electric Utility Providers in Washington State",
       subtitle = "HUGE gap in service between each provider",
       x = "Provider",
       y = "Number of EVs In Region") +
  theme_minimal() +
  theme(plot.title = element_text(size = 16, face = "bold", hjust = 0.5, family = "Arial"),
        plot.subtitle = element_text(size = 11, hjust = 0.5, color = "gray30", family = "Arial"),
        axis.text = element_text(size = 10, family = "Arial"),
        axis.title = element_text(size = 12, face = "bold", family = "Arial"),
        axis.text.x = element_text(),
        legend.position = "none",
        plot.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.background = element_rect(fill = "#F5F5F5", color = NA))

# Plot Creation - Honest 5
ggplot(data, aes(x=`Electric Vehicle Type`, y = `Electric Range`, color = `Electric Vehicle Type`)) +
  geom_boxplot(outlier.shape = NA) +
  coord_flip() +
  labs(title = "Hybrids Exhibit A Smaller Distribution In Effective Range Than Their Battery-Only Counterparts",
       subtitle = "Complete Reliance on Battery Power Calls for More Reliable Effective Range",
       x = "Electric Vehicle Type",
       y = "Electric Range(miles)") +
  theme_minimal() +
  theme(plot.title = element_text(size = 16, face = "bold", hjust = 0.5, family = "Arial"),
        plot.subtitle = element_text(size = 11, hjust = 0.5, color = "gray30", family = "Arial"),
        axis.text = element_text(size = 10, family = "Arial"),
        axis.title = element_text(size = 12, face = "bold", family = "Arial"),
        legend.position = "none",
        plot.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.background = element_rect(fill = "#F5F5F5", color = NA))


# Plot Creation - Biased 5
ev_type_comparison <- data %>%
  filter(`Electric Range` > 0) %>%
  filter(`Electric Vehicle Type` %in% c("Battery Electric Vehicle (BEV)", 
                                        "Plug-in Hybrid Electric Vehicle (PHEV)")) %>%
  group_by(`Electric Vehicle Type`) %>%
  summarise(avg_range = mean(`Electric Range`))

# Bar chart with colors favoring PHEV
ggplot(ev_type_comparison, aes(x = `Electric Vehicle Type`, y = avg_range, 
                               fill = `Electric Vehicle Type`)) +
  geom_bar(stat = "identity", width = 0.6) +
  scale_fill_manual(values = c("Battery Electric Vehicle (BEV)" = "#27AE60",
                               "Plug-in Hybrid Electric Vehicle (PHEV)" = "#E74C3C")) +
  labs(title = "Battery EVs Vastly Outperform Plug-in Hybrids",
       subtitle = "PHEVs lag far behind in electric range capabilities, questioning their viability",
       x = "Electric Vehicle Type",
       y = "Average Electric Range (miles)") +
  theme_minimal() +
  theme(plot.title = element_text(size = 16, face = "bold", hjust = 0.5, family = "Arial"),
        plot.subtitle = element_text(size = 11, hjust = 0.5, color = "gray30", family = "Arial"),
        axis.text = element_text(size = 10, family = "Arial"),
        axis.title = element_text(size = 12, face = "bold", family = "Arial"),
        legend.position = "none",
        plot.background = element_rect(fill = "#F5F5F5", color = NA),
        panel.background = element_rect(fill = "#F5F5F5", color = NA))
