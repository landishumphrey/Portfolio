library(tidyverse)
library(fpp3)

df <- read.csv("./sp500.csv")

df <- df %>%
  mutate(Date = yearweek(Date))

tsib <- df %>%
  as_tsibble(index = Date)

tsib <- tsib %>%
  select(-X)

# Initial plot
autoplot(tsib)

# Seasonality plot
gg_season(tsib)

tsib %>%
  ACF(log(Price)) %>%
  autoplot()

dcmp <- tsib |> model(
  stl=STL(Price~trend()+
  season(),
  robust=TRUE))

components(dcmp) |> as_tsibble() |>
  autoplot(Price, color='darkgray') + geom_line(aes(y=trend), color='green') + labs(y='Price')

components(dcmp) |> autoplot()

mean <- tsib |> features(Price, list(mean=mean)) |> arrange(mean)

acf_feat <- tsib |> features(Price, feat_acf)

stl_feat <- tsib |> features(Price, feat_stl)

prices <- tsib |> filter_index("1992 W01" ~ "2025 W17") |> select(Price)
prices_fit <- prices |> model(Naive=NAIVE(Price), 
                            Mean=MEAN(Price), 
                            SES=ETS(Price ~ error("A")+trend("N")+season("N")))

prices_fc <- forecast(prices_fit, h="5 year")

prices_fc |> autoplot(prices, level=NULL) + labs(y="Price",
                                                 title="S&P 500 Historical Data: Basic Forecasting Models")

prices_fc_naive <- prices_fc |> filter(.model=="Naive")
prices_fc_naive |> autoplot(prices) + labs(y="Price",
                                           title="S&P 500 Historical Data: Naive Confidence Interval") 

prices_fc_ses <- prices_fc |> filter(.model=="SES")
prices_fc_ses |> autoplot(prices) + labs(y="Price",
                                        title="S&P 500 Historical Data: SES Confidence Interval")

prices_fc_mean <- prices_fc |> filter(.model=="Mean")
prices_fc_mean |> autoplot(prices) + labs(y="Price",
                                          title="S&P 500 Historical Data: Mean Confidence Interval")

report(prices_fit |> select(SES))
report(prices_fit |> select(Mean))
report(prices_fit |> select(Naive))

prices_fit |> select(Mean) |> gg_tsresiduals() + labs(title='Mean Residual plots')
prices_fit |> select(Naive) |> gg_tsresiduals() + labs(title='Naive Residual plots')
prices_fit |> select(SES) |> gg_tsresiduals() + labs(title='SES Residual plots')

prices_fit_multiple_SES <- prices |> model(sES=ETS(Price ~ error("A") + trend("N") + season("N")),
                                         tES=ETS(Price ~ error("A") + trend("A") + season("N")),
                                         soES=ETS(Price ~ error("A") + trend("N") + season("A")),
                                         ES=ETS(Price ~ error("A") + trend("A") + season("A")))

prices_multi_SES_fc <- forecast(prices_fit_multiple_SES, h="5 year")

prices_multi_SES_fc |> autoplot(prices, level=NULL) + labs(y="Price", title="S&P 500 Historical Data: Exponential Smoothing")

prices_fc_sES <- prices_multi_SES_fc |> filter(.model=="sES")
prices_fc_sES |> autoplot(prices) + labs(y="Price",
                                         title="S&P 500 Historical Data: SES")

prices_fc_tES <- prices_multi_SES_fc |> filter(.model=="tES")
prices_fc_tES |> autoplot(prices) + labs(y="Price", title="S&P 500 Historical Data: tES")

report(prices_fit_multiple_SES |> select(sES))
report(prices_fit_multiple_SES |> select(tES))

prices_fit_multiple_SES |> select(sES) |> gg_tsresiduals() + labs(title='SES Residual plots')
prices_fit_multiple_SES |> select(tES) |> gg_tsresiduals() + labs(title='tES Residual plots')

prices_pre_2025 <- tsib |> filter(year(Date) < 2025)
prices_post_2025 <- tsib |> filter(year(Date) >= 2025)

pre_2025_prices_fit_multiple_SES <- prices_pre_2025 |> model(sES=ETS(Price ~ error("A") + trend("N") + season("N")),
                                         tES=ETS(Price ~ error("A") + trend("A") + season("N")))

pre_2025_prices_multi_SES_fc <- forecast(pre_2025_prices_fit_multiple_SES, h="1 year")

pre_2025_prices_multi_SES_fc |> autoplot(prices, level=NULL) + labs(y="Price", title="S&P Historical Data: 2025 Predictions")

accuracy(pre_2025_prices_multi_SES_fc, prices)

pre_2025_prices_multi_SES_fc |> accuracy(prices,
                                         list(winkler=winkler_score, level=80))
pre_2025_prices_multi_SES_fc |> accuracy(prices,
                                         list(crps=CRPS))
pre_2025_prices_multi_SES_fc |> accuracy(prices,
                                         list(skill=skill_score(CRPS)))