from flask import Flask, jsonify
from flask_cors import CORS
from nsepython import nsefetch
import traceback

app = Flask(__name__)
CORS(app)

@app.route('/stock/<symbol>')
def get_stock_data(symbol):
    try:
        symbol = symbol.upper()
        url = f"https://www.nseindia.com/api/quote-equity?symbol={symbol}"
        data = nsefetch(url)

        print("\n=========== NSE QUOTE DATA ===========")
        print(data)
        print("=======================================\n")

        price_info = data.get("priceInfo", {})
        if not price_info:
            return jsonify({"error": "No price info found"}), 404

        result = {
            "symbol": symbol,
            "price": price_info.get("lastPrice"),
            "open": price_info.get("open"),
            "high": price_info.get("intraDayHighLow", {}).get("max"),
            "low": price_info.get("intraDayHighLow", {}).get("min"),
            "previous_close": price_info.get("previousClose"),
            "change": price_info.get("change"),
            "change_percent": price_info.get("pChange"),
            "volume": price_info.get("totalTradedVolume"),
            "latest_trading_day": data.get("metadata", {}).get("lastUpdateTime"),
        }

        return jsonify(result)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Failed to fetch data: {str(e)}"}), 500

if __name__ == '__main__':
    from waitress import serve
    serve(app, host='0.0.0.0', port=8080)
