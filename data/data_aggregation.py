import glob
import pandas as pd

def aggregate_data():
    filenames = glob.glob("*.csv")
    dfs = []
    columns = set()
    for filename in filenames:
        df = pd.read_csv(filename, na_values=[" "])
        df["province"] = filename[:-4]
        dfs.append(df)
    for df in dfs:
        df.columns = [column_name.strip() for column_name in df.columns]
        df.fillna(0, inplace=True)
        for column_name in df.columns:
            columns.add(column_name)
    for df in dfs:
        for column_name in columns:
            if column_name not in df.columns:
                df[column_name] = 0.0
    all_data = pd.concat(dfs)
    all_data.loc[all_data["aqi"] == 0, "aqi"] = all_data.loc[all_data["aqi"] == 0, "pm25":"co"].sum(axis=1)
    all_data["date"] = pd.to_datetime(all_data["date"])
    all_data.to_csv("aqi.csv", index=False)

aggregate_data()
