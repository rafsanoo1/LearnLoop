
import { COLORS } from "@/constants/learnloop-theme";
import { TRANSACTIONS } from "@/data/transactions";
import { CreditTransaction } from "@/types/learnloop";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CURRENT_USER_ID = "u1";

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTransactionStyle(
  type: CreditTransaction["type"],
) {
  switch (type) {
    case "earned":
      return {
        icon: "arrow-down-circle-outline" as const,
        color: "#15803D",
        backgroundColor: "#DCFCE7",
        prefix: "+",
      };

    case "spent":
      return {
        icon: "arrow-up-circle-outline" as const,
        color: "#B91C1C",
        backgroundColor: "#FEE2E2",
        prefix: "-",
      };

    case "bonus":
      return {
        icon: "gift-outline" as const,
        color: "#B45309",
        backgroundColor: "#FEF3C7",
        prefix: "+",
      };

    case "refund":
      return {
        icon: "refresh-circle-outline" as const,
        color: "#1D4ED8",
        backgroundColor: "#DBEAFE",
        prefix: "+",
      };
  }
}

export default function CreditHistoryScreen() {
  const userTransactions = TRANSACTIONS.filter(
    (transaction) =>
      transaction.userId === CURRENT_USER_ID,
  ).sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Credit History",
        }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>
          Credit History
        </Text>

        <Text style={styles.subheading}>
          Review your earned, spent, bonus, and refunded credits.
        </Text>

        {userTransactions.length > 0 ? (
          userTransactions.map((transaction) => {
            const transactionStyle =
              getTransactionStyle(transaction.type);

            return (
              <View
                key={transaction.id}
                style={styles.transactionCard}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor:
                        transactionStyle.backgroundColor,
                    },
                  ]}
                >
                  <Ionicons
                    name={transactionStyle.icon}
                    size={24}
                    color={transactionStyle.color}
                  />
                </View>

                <View style={styles.transactionInfo}>
                  <Text
                    style={styles.description}
                    numberOfLines={2}
                  >
                    {transaction.description}
                  </Text>

                  <Text style={styles.meta}>
                    {formatDate(transaction.date)}
                  </Text>

                  <Text style={styles.type}>
                    {transaction.type}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.amount,
                    { color: transactionStyle.color },
                  ]}
                >
                  {transactionStyle.prefix}
                  {transaction.amount}
                </Text>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="wallet-outline"
              size={46}
              color={COLORS.textSecondary}
            />

            <Text style={styles.emptyTitle}>
              No transactions yet
            </Text>

            <Text style={styles.emptyText}>
              Your credit activity will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  content: {
    width: "100%",
    maxWidth: 850,
    alignSelf: "center",
    padding: 16,
    paddingBottom: 40,
  },

  heading: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },

  subheading: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },

  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  iconContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    marginRight: 14,
  },

  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },

  description: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 5,
  },

  meta: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 4,
  },

  type: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textTransform: "capitalize",
  },

  amount: {
    fontSize: 16,
    fontWeight: "800",
  },

  emptyState: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 40,
  },

  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
});