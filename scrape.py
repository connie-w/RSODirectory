from bs4 import BeautifulSoup
import requests
stdout = open('RSO_raw.txt','a')
page_link ='https://uws-community.symplicity.com/index.php? s=student_group& mode=list'
group_class_name = 'grpl '
next_link_name = 'paging_nav'
url_head = "https://uws-community.symplicity.com/index.php"

def print_group(page_response):
    page_link_temp = []
    page_content = BeautifulSoup(page_response.content, "html.parser")
    rso = page_content.find(class_= group_class_name).get_text()
    print(rso)
    #stdout.write(rso)
    page_link_temp = page_content.find(class_= next_link_name).find_all('a')
    return page_link_temp

page_response = requests.get(page_link, timeout = 5)
next_link = str(print_group(page_response)[0])
next_link = next_link[9:len(next_link)-15]
print(url_head+next_link)

for x in range(44):
    page_response = requests.get(url_head+next_link, timeout=5)
    next_link = str(print_group(page_response)[1])
    

#my problem is that the links in the RSO page are like the links below
#BeautifulSoup can't follow them i tried scraping from the site or just scraping the page from the url

#https://uws-community.symplicity.com/index.php?_so_list_from0951a99aa59405c47d2e937b6ff7bbf7=0&_so_list_from0951a99aa59405c47d2e937b6ff7bbf7_page=1
#https://uws-community.symplicity.com/index.php?_so_list_from0951a99aa59405c47d2e937b6ff7bbf7=20&_so_list_from0951a99aa59405c47d2e937b6ff7bbf7_page=2
