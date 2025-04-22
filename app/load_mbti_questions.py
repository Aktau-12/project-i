import json
import os
from app.database.db import SessionLocal
from app.models.mbti import MBTIQuestion

def load_questions():
    file_path = os.path.join(os.path.dirname(__file__), "data", "mbti_questions.json")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Ошибка чтения файла {file_path}: {e}")
        return

    db = SessionLocal()

    try:
        # Безопасное удаление только MBTI вопросов
        deleted = db.query(MBTIQuestion).delete()
        print(f"🧹 Удалено старых вопросов: {deleted}")

        added_count = 0
        for item in data:
            question = MBTIQuestion(
                question_a=item["question_a"],
                question_b=item["question_b"],
                dimension=item["dimension"],
                trait_a=item["trait_a"],
                trait_b=item["trait_b"],
                position=item["position"]
            )
            db.add(question)
            added_count += 1

        db.commit()
        print(f"✅ Загружено {added_count} MBTI вопросов.")
    except Exception as e:
        print(f"❌ Ошибка записи в базу: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    load_questions()
